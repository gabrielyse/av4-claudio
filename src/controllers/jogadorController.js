const jogadorService = require('../services/jogadorService');
const tratarErro = require('../utils/tratarErro');

async function cadastrar(req, res) {
  try {
    const jogador = await jogadorService.cadastrarJogador(req.body || {});
    return res.status(201).json(jogador);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listar(req, res) {
  try {
    const jogadores = await jogadorService.listarJogadores(req.query);
    return res.status(200).json(jogadores);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function consultar(req, res) {
  try {
    const jogador = await jogadorService.buscarJogador(req.params.id);
    return res.status(200).json(jogador);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const jogador = await jogadorService.atualizarJogador(req.params.id, req.body || {});
    return res.status(200).json(jogador);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function desativar(req, res) {
  try {
    const jogador = await jogadorService.desativarJogador(req.params.id);
    return res.status(200).json(jogador);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = { cadastrar, listar, consultar, atualizar, desativar };
