// models/Servico.js
const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
  cliente: {
    nome: String,
    celular: String,
    email: String,
    createdAt: {
      type: Date,
      default: Date.now, // Define a data de criação automaticamente
    }
  },
  veiculo: {
    marca: String,
    modelo: String,
    placa: String
  },
  servico: {
    tipo: String,
    observacao: String
  },
  status: {
    type: String,
    default: 'Registrado' // Status inicial do serviço
  }
});

module.exports = mongoose.model('Servico', servicoSchema);
