const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de Usuario
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para encriptar la contraseña antes de guardarla
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Encriptar la contraseña con un salt de 10 rondas
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas (cuando se haga login)
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
