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
    // Mapea las imágenes a base64 para facilitar su uso en el front
    const formattedTrends = trends.map((shoe) => ({
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
    res.status(200).json(formattedTrends);
  } catch (err) {
    res.status(500).send('Error al obtener las tendencias: ' + err.message);
  }
});

// Ruta para obtener las novendades
router.get('/new', async (req, res) => {
  try {
    const newShoes = await Shoe.find().sort({ uploadDate: -1 }).limit(4);
    // Mapea las imágenes a base64 para facilitar su uso en el front
    const formattedNewShoes = newShoes.map((shoe) => ({
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
    res.status(200).json(formattedNewShoes);
  } catch (err) {
    res.status(500).send('Error al obtener las novedades: ' + err.message);
  }
});

// ruta para obtener el modelo más vendido por categoría
router.get('/top-category', async (req, res) => {
  try {
    const categories = ['casual', 'senora', 'enfermera', 'joven', 'escolar'];
    const topShoes = await Promise.all(
      categories.map(async (category) => {
        const topShoe = await Shoe.findOne({ category }).sort({ sales: -1 });
        if (topShoe) {
          return {
            category,
            shoe: {
              _id: topShoe._id,
              shoeId: topShoe.shoeId,
              description: topShoe.description,
              uploadDate: topShoe.uploadDate,
              sales: topShoe.sales,
              image: `data:${topShoe.image.contentType};base64,${topShoe.image.data.toString('base64')}`,
            },
          };
        } else {
          return { category, shoe: null };
        }
      }),
    );
    res.status(200).json(topShoes);
  } catch (err) {
    res
      .status(500)
      .send(
        'Error al obtener el modelo más vendido por categoría: ' + err.message,
      );
  }
});

// Ruta para obtener todos los zapatos de una categoría
router.get('/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const shoes = await Shoe.find({ category });
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

module.exports = router;
