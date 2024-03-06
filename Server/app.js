const express = require('express');
const PDFParser = require('pdf-parse');
const fs = require('fs');
const app = express();
const uploadDirectory = './uploads';
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('html-pdf');
const pdf2pic = require("pdf2pic");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.get("/api", (req,res)=>{
    res.json({"users":["user1","user2","user3"]})
})
// Route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Retrieve the uploaded file from the request body
    const uploadedFile = req.file;

    // Write the file to the upload directory
    const fileName = `${uploadedFile.originalname}`;
    const filePath = `${uploadDirectory}/${fileName}`;
    const fileData = fs.readFileSync(filePath, 'utf8');
    await processFileData(fileData);

    // Convert PDF to images
    const images = await convertPdfToImages(filePath);
    res.json({ images });
  } catch (error) {
    console.error('An error occurred while processing the file:', error);
    res.status(500).json({ error: 'Failed to process the file' });
  }
});



// Function to process the file data (perform your file processing logic here)
function processFileData(fileData) {
  fs.writeFile('output.txt', fileData, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File written successfully');
    }
  });
}

// Function to convert PDF to images
async function convertPdfToImages(pdfFilePath) {
  const options = {
    density: 100,
    saveFilename: "untitled",
    savePath: "./public",
    format: "png",
    width: 600,
    height: 600
  };
  const converter = new pdf2pic(options);
  return await converter.convertBulk(pdfFilePath, -1);
}

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });