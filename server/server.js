const express = require('express');
const cors = require("cors"); 
const app = express();
const multer = require('multer');
const path = require('path');


// as we are sharign a common.env folder, we config to run at root
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


app.use(cors());
app.use(express.json());

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
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

app.get("/api", (req,res) => {
    res.status(200).json({"users":[
        "userOne","userTwo","userThree","userFour"
    ]});
});

const port = process.env.PORT || 8080;
app.listen(port,() => {
    console.log(`server listening at port:${port}`)
});