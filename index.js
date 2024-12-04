// mongodb+srv://dbUser:<db_password>@superpapos.fbjjf.mongodb.net/?retryWrites=true&w=majority&appName=superpapos
const express = require('express');
const routerApi = require('./routes/router');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuración de Express
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(
    'mongodb+srv://dbUser:Password@superpapos.fbjjf.mongodb.net/?retryWrites=true&w=majority&appName=superpapos',
  )
  .then(() => console.log('Conexión a MongoDB Exitosa'))
  .catch((err) => console.log('No se pudo conectar a MongoDB', err));

routerApi(app);
// Rutas principales
app.get('/', (req, res) => {
  res.send('Hola, mi servidor en Express está funcionando');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log('Servidor funcionando en el puerto: ' + port);
});
