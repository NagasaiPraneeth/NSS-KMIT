const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const approute = require('./route');

// MongoDB connection
mongoose.connect("mongodb+srv://NSP:hello@cluster0.d298u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' }));

// Serve API routes before static files
app.use('/en', approute);

// Serve React build
app.use(express.static(path.join(__dirname, './build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

const port = 5001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
