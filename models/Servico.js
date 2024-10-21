// models/Servico.js
const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
  cliente: {
    nome: String,
    celular: String,
    email: String,
  },
  veiculo: {
    marca: String,
    modelo: String,
    placa: String,
  },
  servico: {
    tipo: String,
    status: {
      type: String,
      default: 'Em andamento', // Status inicial do serviço
    },
    observacao: String,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Servico', servicoSchema);
