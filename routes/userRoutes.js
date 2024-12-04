const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel'); // Asegúrate de que el archivo esté en la carpeta correcta
const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    // Comparar la contraseña con la encriptada
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    // Si la contraseña es correcta
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al iniciar sesión: ' + err.message });
  }
});

// Ruta de registro
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Usuario ya existe' });

    // Crear un nuevo usuario
    const newUser = new User({
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al crear el usuario: ' + err.message });
  }
});

module.exports = router;
