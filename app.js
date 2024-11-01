const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Servico = require('./models/Servico');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/fuel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar MongoDB', err));

// Configurações do Twilio (substitua pelos seus dados)
const accountSid = 'id';
const authToken = 'token'; 
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

// Configuração do Nodemailer para envio de e-mail (substitua pelos seus dados)
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou seu provedor de e-mail
  auth: {
    user: 'SEU_EMAIL@gmail.com',
    pass: 'SUA_SENHA'
  }
});

// Função para enviar e-mail
const enviarEmail = (email, subject, text) => {
  const mailOptions = {
    from: 'SEU_EMAIL@gmail.com',
    to: email,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
    } else {
      console.log('E-mail enviado:', info.response);
    }
  });
};

// Função para enviar SMS
const enviarSMS = (numero, mensagem) => {
  twilioClient.messages
    .create({
      body: mensagem,
      from: twilioPhoneNumber,
      to: numero
    })
    .then(message => console.log('SMS enviado com sucesso, ID:', message.sid))
    .catch(error => console.error('Erro ao enviar SMS:', error));
};

// Rota para atualizar um serviço pelo ID (PUT)
app.put('/servico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const servicoAtualizado = await Servico.findByIdAndUpdate(id, { status }, { new: true });

    if (!servicoAtualizado) return res.status(404).json({ error: 'Serviço não encontrado' });

    const { cliente } = servicoAtualizado;
    const mensagem = `Olá ${cliente.nome}, o status do seu serviço foi atualizado para: ${status}`;

    // Envia SMS e e-mail para o cliente informando a atualização do status
    enviarSMS(cliente.celular, mensagem);
    enviarEmail(cliente.email, 'Atualização do Serviço', mensagem);

    res.json({ message: 'Serviço atualizado com sucesso e notificação enviada!', servico: servicoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
});

// Outras rotas (POST, GET, DELETE) seguem conforme configurado anteriormente

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

