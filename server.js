// server.js
const express = require('express');
const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Inicializar Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://licencias-78db7-default-rtdb.firebaseio.com/',  // Reemplaza con tu URL de Firebase
});

// Obtener referencia a la base de datos de Firebase
const db = firebaseAdmin.database();

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Ruta para obtener todos los datos desde Firebase
app.get('/api/data', async (req, res) => {
  try {
    const ref = db.ref('datos');
    const snapshot = await ref.once('value'); // Realizamos una consulta para obtener los datos
    const data = snapshot.val(); // Extraemos los datos de la respuesta de Firebase

    if (data) {
      // Si encontramos datos, los devolvemos al cliente como una respuesta JSON
      res.status(200).json(data);
    } else {
      // Si no hay datos, enviamos un mensaje de error 404 (No Encontrado)
      res.status(404).json({ message: 'No se encontraron datos' });
    }
  } catch (error) {
    console.error(error);
    // Si ocurre un error, enviamos un mensaje de error 500 (Error en el servidor)
    res.status(500).json({ message: 'Error al obtener los datos', error });
  }
});


// Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
