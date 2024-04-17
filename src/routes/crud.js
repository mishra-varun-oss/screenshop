const path = require('path');
const express = require('express');
const db = require(path.join(__dirname, "../tools/transport_db.js"));
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs  = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = getUploadDir(file.fieldname); // Get upload directory based on file type
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${req.body.driverId}-${file.originalname}`; // Use same driverId for all images
    cb(null, uniqueFilename);
  },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit

});

function getUploadDir(fieldname) {
  switch (fieldname) {
    case 'driverLicense':
      return 'uploads/drivers';
    case 'aadharCard':
      return 'uploads/aadharcard';
    case 'permits':
      return 'uploads/permits';
    default:
      return 'uploads';
  }
}

const upload = multer({ storage: storage });

router.post('/upload', upload.fields([
  { name: 'driverLicense', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'permits', maxCount: 1 }
]), (req, res) => {
  // Extract form data and file paths
  const driverId = req.body.driverId;
  const driverName = req.body.driverName;
  const whatsappNumber = req.body.whatsappNumber;
  const drivingLicense = req.files['driverLicense'][0].path;
  const aadharCard = req.files['aadharCard'][0].path;
  const routingNumber = req.body.routingNumber;
  const accountNumber = req.body.accountNumber;
  const address = req.body.address;
  const permits = req.files['permits'][0].path;

  // Insert data into database
  const sql = `INSERT INTO drivers
              (id, name, whatsapp_number, driving_license, aadhar_card, routing_number, account_number, address, permits)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [driverId, driverName, whatsappNumber, drivingLicense, aadharCard, routingNumber, accountNumber, address, permits];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting driver information into database: ', err);
      res.status(500).json({ error: 'Error inserting driver information into database' });
      return;
    }
    console.log('Driver information inserted into database');
    res.status(200).json({ message: 'Driver information inserted successfully' });
  });
});

router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "../../templates/views/onboarding_driver.html"));
})

module.exports = router;
