const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');
const { sendEmail } = require('../mailgun'); // Importando a função de envio de email
const auth = require('../middleware/auth');

// Função auxiliar para enviar notificações por email
async function enviarEmailAtualizacao(cliente) {
  if (!cliente.email) {
    console.warn('Cliente não possui email para enviar notificação.');
    return;
  }

  const subject = 'Atualização de Serviço';
  const text = `Olá ${cliente.nome},\n\nA atualização do seu serviço foi realizada.\n\nStatus atual: ${cliente.andamento}\n\nSe você tiver alguma dúvida, não hesite em entrar em contato conosco.\n\nAtenciosamente,\nEquipe de Atendimento`;
  const html = `<p>Olá ${cliente.nome},</p><p>A atualização do seu serviço foi realizada.</p><p>Status atual: ${cliente.andamento}</p><p>Se você tiver alguma dúvida, não hesite em entrar em contato conosco.</p><p>Atenciosamente,<br><b>Equipe de Atendimento - Fuelstation APP</b></p>`;

  try {
    await sendEmail(cliente.email, subject, text, html); // Usando a função do Mailgun
    console.log('Email enviado com sucesso');
  } catch (error) {
    console.error('Falha ao enviar email:', error);
  }
}

// Cadastro de Cliente
router.post('/cadastro', auth, async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).send(cliente);  // Use o status 201 para criação
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).send({ message: 'Erro ao cadastrar cliente' });
  }
});

// Atualizar Cliente
router.put('/atualizar/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cliente) {
      return res.status(404).send({ message: 'Cliente não encontrado' });
    }

    // Enviar notificação por email após a atualização
    await enviarEmailAtualizacao(cliente);
    res.send(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).send({ message: 'Erro ao atualizar cliente' });
  }
});

// Listar Clientes
router.get('/', auth, async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.send(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).send({ message: 'Erro ao listar clientes' });
  }
});

// Obter Cliente pelo ID
router.get('/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).send({ message: 'Cliente não encontrado' });
    }
    res.send(cliente);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).send({ message: 'Erro ao obter cliente' });
  }
});

module.exports = router;