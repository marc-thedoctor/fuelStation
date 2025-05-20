const twilio = require('twilio');

const accountSid = '*';  // Substitua pelo seu SID da conta Twilio
const authToken = '*';    // Substitua pelo seu token de autenticação

const client = twilio(accountSid, authToken);

async function sendSMS(to, message) {
  try {
    const sms = await client.messages.create({
      body: message,
      from: 'SEU_NUMERO_TWILIO', // O número comprado na Twilio
      to: to
    });
    console.log('SMS enviado com sucesso:', sms.sid);
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
  }
}

module.exports = { sendSMS };