const express = require('express');
const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Usar JSON parseado desde env
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://licencias-78db7-default-rtdb.firebaseio.com/',
});

const db = firebaseAdmin.database();
const app = express();

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const ref = db.ref('datos');
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'No se encontraron datos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
