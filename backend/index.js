const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// MongoDB connection
mongoose.connect("mongodb+srv://Project:Florencemidhebaramvesam@project.tbx2krn.mongodb.net/Saanjh");

// File schema
const fileSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const File = mongoose.model('File', fileSchema);

// app.use(cors({
//   origin: ["https://invoice-analyzer.vercel.app/"],
//   methods: ["GET", "POST"],
//   credentials: true
// }));
app.use(cors());

const port = 5173;
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

const apiKey = "AIzaSyCqX6XEJ9k1mGC0Q_BP_WblLxSomZrwPPE";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-exp-0801",
  systemInstruction: "you are a invoice analyzer. user will give you invoice . from the invoice fetch customer details,products,total amount and give response as a json. if user upload invalid invoice you must reply as invalid pdf : \"yes\" in json format.",
});

const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        invalid_pdf: {
          type: "boolean"
        },
        customer_details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              mobile_number: {
                type: "string"
              },
              gmail: {
                type: "string"
              },
              billing_address: {
                type: "string"
              },
              shipping_address: {
                type: "string"
              },
              others: {
                type: "string"
              }
            },
            required: [
              "name"
            ]
          }
        },
        products: {
          type: "array",
          items: {
            type: "string"
          }
        },
        total_amount: {
          type: "string"
        }
      },
      required: [
        "invalid_pdf"
      ]
    },
  };

// Custom middleware for file upload
const uploadToMongo = async (req, res, next) => {
  if (!req.body.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const fileData = Buffer.from(req.body.file.split(',')[1], 'base64');
    const contentType = req.body.file.split(';')[0].split(':')[1];

    const file = new File({
      data: fileData,
      contentType: contentType
    });

    const savedFile = await file.save();
    req.fileId = savedFile._id;
    next();
  } catch (error) {
    console.error('Error saving file to MongoDB:', error);
    res.status(500).json({ error: 'An error occurred while uploading the file' });
  }
};

app.post('/analyze-invoice', uploadToMongo, async (req, res) => {
  try {
    const file = await File.findById(req.fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const base64Image = file.data.toString('base64');
    const mimeType = file.contentType;

    // Clean up the temporary file from MongoDB
    await File.findByIdAndDelete(req.fileId);

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image
              }
            },
            { text: "fetch customer details,products,total amount from invoice" },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("fetch customer details,products,total amount from invoice . also add currency symbol in the total amount");
    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the image' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});