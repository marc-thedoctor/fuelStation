const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: String,
  email: String,
  veiculo: String,
  placa: String,
  dataServico: Date,
  servico: String,
  andamento: String,
  observacao: String
});

module.exports = mongoose.model('Cliente', clienteSchema);
