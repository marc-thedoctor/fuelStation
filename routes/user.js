const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const config = require('../config');
const auth = require('../middleware/auth'); // Importando o middleware auth

// Registro de Usuário
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new Usuario({ username, password });
    await user.save();
    res.status(201).send({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login de Usuário
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Usuario.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send({ message: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });
  res.send({ token });
});

// Listar Usuários (somente para demonstração, geralmente não é seguro expor esta rota)
router.get('/', auth, async (req, res) => {
  const usuarios = await Usuario.find();
  res.send(usuarios);
});

module.exports = router;
