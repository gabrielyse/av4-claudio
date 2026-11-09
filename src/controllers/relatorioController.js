const relatorioService = require('../services/relatorioService');
const tratarErro = require('../utils/tratarErro');

async function semanal(req, res) {
  try {
    const relatorio = await relatorioService.gerarRelatorioSemanal(req.query.data);
    return res.status(200).json(relatorio);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = { semanal };
