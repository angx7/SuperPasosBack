const express = require('express');
const router = express.Router();
const multer = require('multer');
const Shoe = require('../models/Shoe'); // Asegúrate de tener el modelo Shoe definido

// Configuración de Multer (para manejar la subida de imágenes)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir un zapato
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Validar y convertir la fecha (si es enviada)
    const uploadDate = req.body.uploadDate
      ? new Date(req.body.uploadDate) // Convertir a tipo Date
      : new Date(); // Usar la fecha actual como predeterminada

    // Comprobar si la fecha es válida
    if (isNaN(uploadDate.getTime())) {
      return res.status(400).send('Fecha inválida');
    }

    const newShoe = new Shoe({
      shoeId: req.body.shoeId,
      description: req.body.description, // Añadir la descripción
      category: req.body.category, // Añadir la categoría
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      uploadDate: uploadDate,
      sales: req.body.sales || 0,
    });

    await newShoe.save();
    res.status(201).send('Zapato subido exitosamente');
  } catch (err) {
    res.status(500).send('Error al subir el zapato: ' + err.message);
  }
});

// Ruta para obtener todos los zapatos
router.get('/', async (req, res) => {
  try {
    const shoes = await Shoe.find();
    // Mapea las imágenes a base64 para facilitar su uso en el front
    const formattedShoes = shoes.map((shoe) => ({
      _id: shoe._id,
      shoeId: shoe.shoeId,
      description: shoe.description,
      category: shoe.category,
      uploadDate: shoe.uploadDate,
      sales: shoe.sales,
      image: `data:${shoe.image.contentType};base64,${shoe.image.data.toString(
        'base64',
      )}`,
    }));
    res.status(200).json(formattedShoes);
  } catch (err) {
    res.status(500).send('Error al obtener los zapatos: ' + err.message);
  }
});

// Ruta para eliminar un zapato por ID
router.delete('/:id', async (req, res) => {
  try {
    const shoeId = req.params.id;
    const deletedShoe = await Shoe.findByIdAndDelete(shoeId);

    if (!deletedShoe) {
      return res.status(404).send('Zapato no encontrado');
    }

    res.status(200).send('Zapato eliminado exitosamente');
  } catch (err) {
    res.status(500).send('Error al eliminar el zapato: ' + err.message);
  }
});

// Ruta tendencias
router.get('/trends', async (req, res) => {
  try {
    const trends = await Shoe.find().sort({ sales: -1 }).limit(8);
    res.status(200).json(trends);
  } catch (err) {
    res.status(500).send('Error al obtener las tendencias: ' + err.message);
  }
});

module.exports = router;
