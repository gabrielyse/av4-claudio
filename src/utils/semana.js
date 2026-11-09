const AppError = require('./AppError');

// Recebe uma data (AAAA-MM-DD) e retorna o intervalo da semana: segunda 00:00 até domingo 23:59:59.999 (UTC).
function obterSemana(dataTexto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataTexto || '')) {
    throw new AppError('Informe a data no formato AAAA-MM-DD.', 400);
  }
  const data = new Date(`${dataTexto}T00:00:00.000Z`);
  if (Number.isNaN(data.getTime())) {
    throw new AppError('Data inválida.', 400);
  }

  const diaSemana = data.getUTCDay(); // 0 = domingo, 1 = segunda, ...
  const diasDesdeSegunda = diaSemana === 0 ? 6 : diaSemana - 1;

  const inicio = new Date(data);
  inicio.setUTCDate(data.getUTCDate() - diasDesdeSegunda);

  const fim = new Date(inicio);
  fim.setUTCDate(inicio.getUTCDate() + 6);
  fim.setUTCHours(23, 59, 59, 999);

  return { inicio, fim };
}

module.exports = { obterSemana };
