const { ValidationError, UniqueConstraintError } = require('sequelize');
const AppError = require('./AppError');

// Converte erros em respostas JSON sem expor detalhes do banco ou credenciais.
function tratarErro(res, erro) {
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }
  if (erro instanceof UniqueConstraintError) {
    return res.status(409).json({ erro: 'Registro duplicado: o código informado já existe.' });
  }
  if (erro instanceof ValidationError) {
    return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erro.errors.map((e) => e.message) });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = tratarErro;
