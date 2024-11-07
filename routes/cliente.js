const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');
const nodemailer = require('nodemailer');
const config = require('../config');
const auth = require('../middleware/auth');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'cdptaub@gmail.com',
        pass: 'Laika*171'
    }
});

// Cadastro de Cliente
router.post('/cadastro', auth, async (req, res) => {
  const cliente = new Cliente(req.body);
  await cliente.save();
  res.send(cliente);
});

// Atualizar Cliente
router.put('/atualizar/:id', auth, async (req, res) => {
  const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });

  const mailOptions = {
    from: config.emailUser,
    to: cliente.email,
    subject: 'Atualização de Serviço',
    text: `O andamento do seu serviço foi atualizado para: ${cliente.andamento}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });

  res.send(cliente);
});

// Listar Clientes
router.get('/', auth, async (req, res) => {
  const clientes = await Cliente.find();
  res.send(clientes);
});

// Obter Cliente pelo ID
router.get('/:id', auth, async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).send({ message: 'Cliente não encontrado' });
    }
    res.send(cliente);
  });
  

module.exports = router;
