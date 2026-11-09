const { Jogador } = require('../models');
const AppError = require('../utils/AppError');

async function cadastrarJogador(dados) {
  const { nome, posicao } = dados;
  return Jogador.create({ nome, posicao, ativo: true });
}

async function listarJogadores(filtros) {
  const where = {};
  if (filtros.posicao) where.posicao = filtros.posicao;
  return Jogador.findAll({ where, order: [['id', 'ASC']] });
}

async function buscarJogador(id) {
  const jogador = await Jogador.findByPk(id);
  if (!jogador) throw new AppError('Jogador não encontrado.', 404);
  return jogador;
}

async function atualizarJogador(id, dados) {
  const jogador = await buscarJogador(id);
  const { nome, posicao } = dados;
  return jogador.update({ nome, posicao });
}

// Desativação lógica: o jogador permanece no banco e seus treinos (histórico) são preservados.
async function desativarJogador(id) {
  const jogador = await buscarJogador(id);
  return jogador.update({ ativo: false });
}

module.exports = { cadastrarJogador, listarJogadores, buscarJogador, atualizarJogador, desativarJogador };
