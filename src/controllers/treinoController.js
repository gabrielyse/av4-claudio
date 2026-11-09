const treinoService = require('../services/treinoService');
const tratarErro = require('../utils/tratarErro');

async function registrar(req, res) {
  try {
    const treino = await treinoService.registrarTreino(req.body || {});
    return res.status(201).json(treino);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listar(req, res) {
  try {
    const treinos = await treinoService.listarTreinos(req.query);
    return res.status(200).json(treinos);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listarPorJogador(req, res) {
  try {
    const treinos = await treinoService.listarTreinosDoJogador(req.params.id);
    return res.status(200).json(treinos);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function excluir(req, res) {
  try {
    await treinoService.excluirTreino(req.params.codigo);
    return res.status(200).json({ mensagem: 'Treino excluído com sucesso.' });
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = { registrar, listar, listarPorJogador, excluir };
