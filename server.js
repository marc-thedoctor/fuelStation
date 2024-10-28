const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Servico = require('./models/Servico');
const twilio = require('twilio'); // Importando o Twilio
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/fuel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar MongoDB', err));

// Configuração do Twilio
const accountSid = 'ID Twilio';
const authToken = 'token Twilio';
const client = twilio(accountSid, authToken);

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

    const novoServico = new Servico({
      cliente,
      veiculo,
      servico
    });

    await novoServico.save();

    // Enviar SMS inicial
    client.messages
      .create({
        from: '+SEU_NUMERO_TWILIO',
        to: cliente.celular,
        body: `Olá ${cliente.nome}, seu serviço de ${servico.tipo} foi registrado e está em andamento.`,
      })
      .then(message => console.log('SMS enviado:', message.sid))
      .catch(error => console.error('Erro ao enviar SMS:', error));

    res.status(201).json({ message: 'Serviço registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar serviço' });
  }
});

// Rota para atualizar o status do serviço
app.put('/servico/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Atualizar o status do serviço no banco de dados
    const servico = await Servico.findByIdAndUpdate(id, { status }, { new: true });
    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Enviar SMS ao cliente sobre o novo status
    client.messages
      .create({
        from: '+SEU_NUMERO_TWILIO',
        to: servico.cliente.celular,
        body: `Olá ${servico.cliente.nome}, o status do seu serviço de ${servico.servico.tipo} foi atualizado para: ${status}.`,
      })
      .then(message => console.log('SMS de atualização enviado:', message.sid))
      .catch(error => console.error('Erro ao enviar SMS de atualização:', error));

    res.json({ message: 'Status atualizado e SMS enviado!', servico });
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
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
