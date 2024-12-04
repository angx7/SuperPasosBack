const mongoose = require('mongoose');

// const ShoeSchema = new mongoose.Schema({
//   shoeId: { type: String, required: true, unique: true }, // ID único del zapato
//   image: {
//     data: Buffer, // Datos binarios de la imagen
//     contentType: String, // Tipo MIME (por ejemplo, 'image/jpeg')
//   },
//   uploadDate: { type: Date, default: Date.now }, // Fecha de subida
//   sales: { type: Number, default: 0 }, // Cantidad de ventas
// });
const ShoeSchema = new mongoose.Schema({
  shoeId: { type: String, required: true, unique: true },
  description: { type: String, required: true }, // Descripción del zapato
  category: { type: String, required: true }, // Categoría del zapato
  image: {
    data: Buffer,
    contentType: String,
  },
  uploadDate: { type: Date, default: Date.now }, // Permite sobrescribirlo desde el cliente
  sales: { type: Number, default: 0 },
});

module.exports = mongoose.model('Shoe', ShoeSchema);
