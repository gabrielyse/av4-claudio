const { Op } = require('sequelize');
const { Treino, Jogador } = require('../models');
const AppError = require('../utils/AppError');
const { calcularCarga } = require('../utils/calcularCarga');

async function registrarTreino(dados) {
  const { codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade } = dados;

  const jogador = await Jogador.findByPk(jogadorId);
  if (!jogador) throw new AppError('Jogador não encontrado.', 404);
  if (!jogador.ativo) throw new AppError('Não é possível registrar treino para jogador inativo.', 400);

  // Valida os dados pelo model antes de calcular a carga (intensidade 1-10, duração positiva, tipo válido...).
  const treino = Treino.build({ codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade });
  await treino.validate({ skip: ['carga'] });

  treino.carga = calcularCarga(treino.duracaoMin, treino.intensidade, treino.tipo);
  return treino.save();
}

async function listarTreinos(filtros) {
  const { jogadorId, tipo, dataInicio, dataFim } = filtros;
  const where = {};

  const formatoData = /^\d{4}-\d{2}-\d{2}$/;
  if ((dataInicio && !formatoData.test(dataInicio)) || (dataFim && !formatoData.test(dataFim))) {
    throw new AppError('As datas do período devem estar no formato AAAA-MM-DD.', 400);
  }

  if (jogadorId) where.jogadorId = jogadorId;
  if (tipo) where.tipo = tipo;
  if (dataInicio && dataFim) {
    where.dataTreino = { [Op.between]: [new Date(`${dataInicio}T00:00:00.000Z`), new Date(`${dataFim}T23:59:59.999Z`)] };
  } else if (dataInicio) {
    where.dataTreino = { [Op.gte]: new Date(`${dataInicio}T00:00:00.000Z`) };
  } else if (dataFim) {
    where.dataTreino = { [Op.lte]: new Date(`${dataFim}T23:59:59.999Z`) };
  }

  return Treino.findAll({
    where,
    include: [{ model: Jogador, attributes: ['id', 'nome', 'posicao', 'ativo'] }],
    order: [['dataTreino', 'ASC'], ['codigo', 'ASC']],
  });
}

async function listarTreinosDoJogador(jogadorId) {
  const jogador = await Jogador.findByPk(jogadorId);
  if (!jogador) throw new AppError('Jogador não encontrado.', 404);
  return listarTreinos({ jogadorId });
}

async function excluirTreino(codigo) {
  const treino = await Treino.findOne({ where: { codigo } });
  if (!treino) throw new AppError('Treino não encontrado.', 404);
  await treino.destroy();
}

module.exports = { registrarTreino, listarTreinos, listarTreinosDoJogador, excluirTreino };
