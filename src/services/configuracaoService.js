const { Configuracao } = require('../models');
const AppError = require('../utils/AppError');

// Retorna a configuração vigente (registro mais recente) ou null.
async function obterConfiguracaoAtual() {
  return Configuracao.findOne({ order: [['id', 'DESC']] });
}

async function consultarConfiguracao() {
  const configuracao = await obterConfiguracaoAtual();
  if (!configuracao) throw new AppError('Limite máximo semanal ainda não configurado.', 404);
  return configuracao;
}

// Cadastra a configuração se ainda não existir; caso contrário, atualiza.
async function atualizarConfiguracao(dados) {
  const { cargaMaximaSemanal, dataVigencia } = dados;
  const configuracao = await obterConfiguracaoAtual();
  if (!configuracao) {
    return { criada: true, configuracao: await Configuracao.create({ cargaMaximaSemanal, dataVigencia }) };
  }
  return { criada: false, configuracao: await configuracao.update({ cargaMaximaSemanal, dataVigencia }) };
}

module.exports = { obterConfiguracaoAtual, consultarConfiguracao, atualizarConfiguracao };
