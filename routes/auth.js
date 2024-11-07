const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const config = require('../config');

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

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Usuario.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send({ message: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });
  res.send({ token });
});

module.exports = router;
