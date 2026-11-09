const { Op, fn, col } = require('sequelize');
const { Treino, Jogador } = require('../models');
const { obterSemana } = require('../utils/semana');
const { obterConfiguracaoAtual } = require('./configuracaoService');

const arredondar = (valor) => Number(Number(valor).toFixed(2));

async function gerarRelatorioSemanal(dataReferencia) {
  const { inicio, fim } = obterSemana(dataReferencia);
  const whereSemana = { dataTreino: { [Op.between]: [inicio, fim] } };

  const configuracao = await obterConfiguracaoAtual();
  const limite = configuracao ? Number(configuracao.cargaMaximaSemanal) : null;

  // Total de treinos da semana (COUNT).
  const totalTreinos = await Treino.count({ where: whereSemana });

  // Carga semanal e número de treinos por jogador (SUM, COUNT, GROUP BY e include).
  const linhasJogadores = await Treino.findAll({
    attributes: [
      'jogadorId',
      [fn('SUM', col('carga')), 'cargaSemanal'],
      [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'],
    ],
    include: [{ model: Jogador, attributes: ['nome', 'posicao'] }],
    where: whereSemana,
    group: ['Treino.jogadorId', 'Jogador.id'],
    order: [[fn('SUM', col('carga')), 'DESC']],
  });

  const porJogador = linhasJogadores.map((linha) => {
    const cargaSemanal = arredondar(linha.get('cargaSemanal'));
    let situacao = 'LIMITE NÃO CONFIGURADO';
    if (limite !== null) {
      // Risco somente quando a soma for estritamente maior que o limite (empate não sinaliza).
      situacao = cargaSemanal > limite ? 'RISCO DE SOBRECARGA' : 'DENTRO DO LIMITE';
    }
    return {
      jogadorId: linha.jogadorId,
      nome: linha.Jogador.nome,
      posicao: linha.Jogador.posicao,
      cargaSemanal,
      quantidadeTreinos: Number(linha.get('quantidadeTreinos')),
      situacao,
    };
  });

  // Maior e menor carga: em caso de empate, todos os empatados são retornados.
  let maiorCargaSemanal = [];
  let menorCargaSemanal = [];
  if (porJogador.length > 0) {
    const maior = Math.max(...porJogador.map((j) => j.cargaSemanal));
    const menor = Math.min(...porJogador.map((j) => j.cargaSemanal));
    maiorCargaSemanal = porJogador
      .filter((j) => j.cargaSemanal === maior)
      .map(({ nome, posicao, cargaSemanal, quantidadeTreinos }) => ({ nome, posicao, total: cargaSemanal, quantidadeTreinos }));
    menorCargaSemanal = porJogador
      .filter((j) => j.cargaSemanal === menor)
      .map(({ nome, posicao, cargaSemanal }) => ({ nome, posicao, total: cargaSemanal }));
  }

  const jogadoresEmRisco = porJogador.filter((j) => j.situacao === 'RISCO DE SOBRECARGA').length;

  // Carga média das sessões por tipo (AVG + GROUP BY tipo).
  const linhasTipo = await Treino.findAll({
    attributes: ['tipo', [fn('AVG', col('carga')), 'cargaMedia']],
    where: whereSemana,
    group: ['tipo'],
    raw: true,
  });
  const mediaPorTipo = ['F', 'T', 'E'].map((tipo) => {
    const linha = linhasTipo.find((l) => l.tipo === tipo);
    return { tipo, cargaMedia: linha ? arredondar(linha.cargaMedia) : 0 };
  });

  // Quantidade de treinos e carga média por sessão por posição (include + GROUP BY posição).
  const linhasPosicao = await Treino.findAll({
    attributes: [
      [col('Jogador.posicao'), 'posicao'],
      [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'],
      [fn('AVG', col('Treino.carga')), 'cargaMediaSessao'],
    ],
    include: [{ model: Jogador, attributes: [] }],
    where: whereSemana,
    group: ['Jogador.posicao'],
    raw: true,
  });
  const porPosicao = ['G', 'Z', 'M', 'A'].map((posicao) => {
    const linha = linhasPosicao.find((l) => l.posicao === posicao);
    return {
      posicao,
      quantidadeTreinos: linha ? Number(linha.quantidadeTreinos) : 0,
      cargaMediaSessao: linha ? arredondar(linha.cargaMediaSessao) : 0,
    };
  });

  return {
    semana: {
      inicio: inicio.toISOString().slice(0, 10),
      fim: fim.toISOString().slice(0, 10),
    },
    limiteSemanal: limite,
    criterio: 'Os rankings (maior e menor carga) consideram apenas jogadores com pelo menos um treino na semana. Em caso de empate, todos os empatados são listados.',
    mensagem: totalTreinos === 0 ? 'Nenhum treino registrado nesta semana.' : null,
    totalTreinos,
    porJogador,
    maiorCargaSemanal,
    menorCargaSemanal,
    jogadoresEmRisco,
    mediaPorTipo,
    porPosicao,
  };
}

module.exports = { gerarRelatorioSemanal };
