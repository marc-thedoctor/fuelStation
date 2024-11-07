const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const clienteRoutes = require('./routes/cliente');
const userRoutes = require('./routes/user');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Servindo arquivos estáticos da pasta public

mongoose.connect('mongodb://localhost:27017/meuServico');

app.use('/cliente', clienteRoutes);
app.use('/user', userRoutes);

// Rota principal direcionando para a página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
