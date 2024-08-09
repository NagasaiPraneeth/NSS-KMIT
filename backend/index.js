const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const multer = require('multer');

app.use(cors(
    {
        origin:["https://invoice-analyzer.vercel.app/"],
        methods: ["GET", "POST"],
        credentials: true
    }
));

const port = process.env.PORT;
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


const fs = require('fs').promises;
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const upload = multer({ dest: 'uploads/' });


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

async function fileToBase64(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  return fileBuffer.toString('base64');
}

app.post('/analyze-invoice', upload.single('image'), async (req, res) => {
  try {
    console.log("hi");
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const base64Image = await fileToBase64(req.file.path);
    const mimeType = req.file.mimetype;

    // Clean up the temporary file
    await fs.unlink(req.file.path);

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
            {text: "fetch customer details,products,total amount from invoice"},
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Analyze the invoice image");
    console.log(result.response.text())
    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the image' });
  }
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
