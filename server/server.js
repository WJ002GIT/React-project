const express = require('express');
const cors = require("cors"); 
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const portfinder = require('portfinder')


// Resolve the absolute path to the root directory
const rootEnvPath = path.resolve(__dirname, '../.env');

// as we are sharign a common.env folder, we config to run at root
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


app.use(cors());
app.use(express.json());

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //keep original upload file neame
      cb(null, path.join(__dirname, "uploads/"));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Keep the original filename
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Endpoint to handle file upload
  app.post('/upload', upload.single('csvFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    // Send the file path back to the client for further processing
    res.json({ fileUrl: `/uploads/${req.file.filename}` });
  });
  
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/api", (req,res) => {
//     res.status(200).json({"users":[
//         "userOne","userTwo","userThree","userFour"
//     ]});
// });

// const port = process.env.PORT || 8080;

const desiredPort = process.env.PORT || 8080;
//this is to create an adaptable port as not every computer have 5000 available
//portfinder increases the port number by 1 auto if the desiredPort is unavailable

portfinder
  .getPortPromise({ port: desiredPort })
  .then((port) => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);

      // Update or add VITE_BACKEND_PORT in the .env file
      let fileContent = '';
      if (fs.existsSync(rootEnvPath)) {
        fileContent = fs.readFileSync(rootEnvPath, 'utf-8');
      }

      const lines = fileContent.split('\n');
      let updated = false;

      const updatedLines = lines.map((line) => {
        if (line.startsWith('VITE_BACKEND_PORT=')) {
          updated = true;
          return `VITE_BACKEND_PORT=${port}`; // Update the line
        }
        return line; // Keep other lines unchanged
      });

      if (!updated) {
        updatedLines.push(`VITE_BACKEND_PORT=${port}`); // Add the line if it doesn't exist
      }

      fs.writeFileSync(rootEnvPath, updatedLines.join('\n'), 'utf-8');
    });
  })
  .catch((err) => {
    console.error('Error finding available port:', err);
  });


// Endpoint to get list of files in the uploads folder
app.get("/api/files", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");

  // Read the files in the uploads directory
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read files" });
    }

    // Return the list of files as a JSON response
    res.json({ files });
  });
});

// Route to delete a file
app.delete('/api/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists using fs.access (non-deprecated method)
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }

    // If the file exists, delete it
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete file' });
      }
      res.status(200).json({ message: 'File deleted successfully' });
    });
  });
});

  app.get('/api/port', (req, res) => {
    res.json({ port: process.env.VITE_BACKEND_PORT });
  });
  
// app.listen(port,() => {
//     console.log(`server listening at port:${port}`)
// });