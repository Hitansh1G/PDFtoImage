const express = require('express');
const { fromPath } = require('pdf2pic');
const { join } = require('path');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const path = require('path');
const multer = require('multer');



const app = express();
const port = process.env.PORT || 3000;
const uploadsFolder = './uploads';
const upload = multer({ dest: uploadsFolder });
app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        // Delete existing files in the uploads folder
        const files = await fs.readdir(uploadsFolder);
        for (const file of files) {
            await fs.unlink(join(uploadsFolder, file));
        }

        // Move the uploaded file into the uploads folder
        await fs.move(req.file.path, join(uploadsFolder, req.file.originalname));

        res.status(200).send('PDF uploaded successfully');
    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/upload', async (req, res) => {
    try {
        console.log("1");

        const files = await fs.readdir(uploadsFolder);
        console.log("12");

        if (files.length === 0) {
            return res.status(404).send('No PDF files found in the uploads folder.');
        }
        console.log("123");

        const pdfPath = join(uploadsFolder, files[0]);

        console.log("4");
        const outputDirectory = './output/from-pdf-to-image';
        console.log("5");
        rimraf.sync(outputDirectory);
        console.log("6");
        await fs.mkdirs(outputDirectory);
        console.log("7");
        const convert = fromPath(pdfPath, {
            width: 2550,
            height: 3300,
            density: 330,
            savePath: outputDirectory
        });

        await convert(1);
        console.log("8");
        const convertedFiles = await fs.readdir(outputDirectory);
        console.log("9");
        // const convertedImage = join(outputDirectory, convertedFiles[0]);
        console.log("10");
        const convertedImage = path.resolve(join(outputDirectory, convertedFiles[0]));

        res.sendFile(convertedImage);
        console.log("11");
    } catch (error) {
        console.error('Error converting PDF to image:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
