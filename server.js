// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Servico = require('./models/Servico');

const app = express();
app.use(bodyParser.json());

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/fuel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar MongoDB', err));

// Transporter do Nodemailer para envio de e-mails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seu_email@gmail.com', // Substitua pelo seu email
    pass: 'sua_senha', // Substitua pela sua senha de email
  },
});

// Rota para registrar o serviço
app.post('/servico', async (req, res) => {
  try {
    const { cliente, veiculo, servico } = req.body;

    // Criar novo registro de serviço
    const novoServico = new Servico({
      cliente,
      veiculo,
      servico
    });

    await novoServico.save();

    // Enviar e-mail para o cliente sobre o início do serviço
    const mailOptions = {
      from: 'seu_email@gmail.com',
      to: cliente.email,
      subject: 'Serviço registrado com sucesso!',
      text: `Olá ${cliente.nome}, seu serviço de ${servico.tipo} foi registrado e está em andamento.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Erro ao enviar email:', error);
      } else {
        console.log('Email enviado:', info.response);
      }
    });

    res.status(201).json({ message: 'Serviço registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar serviço' });
  }
});

// Rota para atualizar o status do serviço
app.patch('/servico/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const servico = await Servico.findByIdAndUpdate(req.params.id, { 'servico.status': status }, { new: true });

    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Enviar mensagem ao cliente sobre a atualização do status
    const mailOptions = {
      from: 'seu_email@gmail.com',
      to: servico.cliente.email,
      subject: `Atualização do serviço: ${servico.servico.tipo}`,
      text: `Olá ${servico.cliente.nome}, o status do seu serviço foi atualizado para: ${status}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Erro ao enviar email:', error);
      } else {
        console.log('Email enviado:', info.response);
      }
    });

    res.json(servico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do serviço' });
  }
});

// Rota para listar todos os serviços
app.get('/servicos', async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} http://localhost:3000/`));
