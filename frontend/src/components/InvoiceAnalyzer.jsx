import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { 
  Box, Typography, Button, Paper, CircularProgress, 
  Alert, AlertTitle, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DropzoneArea = ({ children, ...props }) => (
  <Box
    {...props}
    sx={{
      border: '2px dashed #1976d2',
      borderRadius: 2,
      padding: 4,
      textAlign: 'center',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    }}
  >
    {children}
  </Box>
);

const InvoiceAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invalidPdf, setInvalidPdf] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setError(null);
    setInvalidPdf(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image file');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setInvalidPdf(false);
  
    try {
      // Convert file to base64
      const base64File = await fileToBase64(file);
  
      const response = await axios.post('/analyze-invoice', {
        file: base64File
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = JSON.parse(response.data.analysis);
      if (data.invalid_pdf) {
        setInvalidPdf(true);
      } else {
        setAnalysis(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'An error occurred while analyzing the invoice');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to convert File to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Analyzer
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <DropzoneArea {...getRootProps()}>
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
          {isDragActive ? (
            <Typography>Drop the file here ...</Typography>
          ) : (
            <Typography>Drag 'n' drop an invoice image here, or click to select a file</Typography>
          )}
        </DropzoneArea>
        {file && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected file: {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading || !file}
          sx={{ mt: 2 }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Invoice'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {invalidPdf && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Invalid PDF</AlertTitle>
          The uploaded file appears to be an invalid or unsupported PDF. Please try again with a different file.
        </Alert>
      )}

      {analysis && !invalidPdf && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Analysis Result
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Details
            </Typography>
            {analysis.customer_details.map((customer, index) => (
              <TableContainer component={Paper} key={index} sx={{ mb: 2 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell>{customer.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell>{customer.gmail}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Phone</strong></TableCell>
                      <TableCell>{customer.mobile_number}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Billing Address</strong></TableCell>
                      <TableCell>{customer.billing_address}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Shipping Address</strong></TableCell>
                      <TableCell>{customer.shipping_address}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ))}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Products
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analysis.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Total Amount
            </Typography>
            <Typography variant="h4" color="primary">
              {analysis.total_amount}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default InvoiceAnalyzer;