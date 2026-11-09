const configuracaoService = require('../services/configuracaoService');
const tratarErro = require('../utils/tratarErro');

async function consultar(req, res) {
  try {
    const configuracao = await configuracaoService.consultarConfiguracao();
    return res.status(200).json(configuracao);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const { criada, configuracao } = await configuracaoService.atualizarConfiguracao(req.body || {});
    return res.status(criada ? 201 : 200).json(configuracao);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = { consultar, atualizar };
