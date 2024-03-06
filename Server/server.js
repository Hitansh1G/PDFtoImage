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
// import { fromPath } from "pdf2pic";
import { PdfDocument } from "@ironsoftware/ironpdf";
import { IronPdfGlobalConfig } from "@ironsoftware/ironpdf";



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


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const uploadedFile = req.file;
    const fileName = `${uploadedFile.originalname}`;
    const filePath = `${uploadDirectory}/${fileName}`;
    const fileData = fs.readFileSync(filePath, 'utf8');
    await processFileData(fileData);
    console.log("1");

    



    const images = await convertPdfToImages(filePath);
    console.log("2");
    const publicPath = path.join(__dirname, 'public');
    console.log(publicPath)

    // const imageName = `${fileName.split('.').slice(0, -1).join('.')}_1.png`; 
    // fs.writeFileSync(path.join(publicPath, imageName), images[0]);

    console.log("poiouiyhughfc")
    res.json({ images });
    console.log("3");
  } catch (error) {
    console.error('An error occurred while processing the file:', error);
    console.log("1242");
    res.status(500).json({ error: 'Failed to process the file' });
  }
});


function processFileData(fileData) {
  fs.writeFile('output.txt', fileData, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File written successfully');
    }
  });
}
async function convertPdfToImages(pdfFilePath) {
    console.log("started")
    const options = {
      density: 100,
      saveFilename: "untitled",
      savePath: "./public",
      format: "png",
      width: 600,
      height: 600
    };
   
    console.log("here")
    try {
        console.log("in try")

        const pdfFilePath = path.join(__dirname, "uploads", "Sample.pdf"); 
        const pageToConvertAsImage = 1;
      console.log("afterconverter")
      const convert = pdf2pic.fromPath("./uploads/Sample.pdf", options);
    //   const convert = fromPath("./uploads/Sample.pdf", baseOptions);

      console.log("hhhhhhh")
      console.log(convert)
      console.log(convert[1]);
      console.log(convert[0]);
      console.log(convert[2]);
    //   console.log(convert.bulk(-1));
      return convert[1];

    return convert[1];
    //   const images = await convert.convertBulk(pdfFilePath, -1);
    //   console.log("here1")
    //   return images;
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      throw error;
    }
  }
app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });