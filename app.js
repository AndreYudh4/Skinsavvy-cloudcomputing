const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { PythonShell } = require('python-shell');

// Inisialisasi aplikasi Express
const app = express();
app.use(bodyParser.json());

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('/home/c319d4ky0342/skinsavvy-api/serviceaccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = new Storage();
const bucketName = 'bucket_skinsavvy'; // Ganti dengan nama bucket Anda

// Fungsi untuk mengunggah model ke Google Cloud Storage
async function uploadModel(filePath, destinationFileName) {
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: destinationFileName,
    });
    console.log(`Model ${destinationFileName} berhasil diunggah.`);
    return true;
  } catch (error) {
    console.error('Gagal mengunggah model:', error);
    return false;
  }
}

// Fungsi untuk mengunduh model dari Google Cloud Storage
async function downloadModel(sourceFileName, localFilePath) {
  try {
    await storage.bucket(bucketName).file(sourceFileName).download({
      destination: localFilePath,
    });
    console.log(`Model ${sourceFileName} berhasil diunduh ke ${localFilePath}.`);
    return true;
  } catch (error) {
    console.error('Gagal mengunduh model:', error);
    return false;
  }
}

// Import routes
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);

// Jalankan server di port 3000 atau port yang tersedia
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
