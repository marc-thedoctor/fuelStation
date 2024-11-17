const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const clienteRoutes = require('./routes/cliente');
const userRoutes = require('./routes/user');
const { sendEmail } = require('./mailgun'); // Importando a função de envio de email

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Servindo arquivos estáticos da pasta public

mongoose.connect('mongodb://localhost:27017/meuServico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Usando as rotas
app.use('/cliente', clienteRoutes);
app.use('/user', userRoutes);

// Rota principal direcionando para a página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para enviar email
app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail(to, subject, text, html);
    res.status(200).send('Email enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).send('Erro ao enviar email');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});