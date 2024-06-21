const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Inisialisasi aplikasi Express
const app = express();
app.use(bodyParser.json());

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('...'); //
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// API untuk mendaftar pengguna baru
app.post('/api/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      displayName: displayName
    });
    res.status(201).send(userRecord);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API untuk mendapatkan profil pengguna
app.get('/api/profile', async (req, res) => {
  const uid = req.headers.authorization;
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      res.status(200).send(userDoc.data());
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API untuk memperbarui profil pengguna
app.put('/api/profile', async (req, res) => {
  const { uid, displayName } = req.body;
  try {
    await admin.auth().updateUser(uid, { displayName });
    await db.collection('users').doc(uid).update({ displayName });
    res.status(200).send('Profile updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Jalankan server di port 3000 atau port yang tersedia
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
