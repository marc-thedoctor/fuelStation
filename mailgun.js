require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');

// Initialize Mailgun
const mailgun = new Mailgun(formData);

// Setup your Mailgun client
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.mailgun.net'
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: 'Fuelstation APP - Posto de Combustível <1716224@aluno.univesp.br>',
      to: [to],
      subject: subject,
      text: text,
      html: html
    });
    console.log('Email enviada com sucesso:', result);
  } catch (error) {
    console.error('Error ao enviar email:', error);
  }
};

module.exports = { sendEmail };