const MULTIPLICADORES = {
  F: 1.5, // Físico
  T: 1.2, // Técnico
  E: 1.0, // Estratégico
};

// Carga do treino = (duração em minutos / 10) × intensidade × multiplicador do tipo.
function calcularCarga(duracaoMin, intensidade, tipo) {
  const carga = (duracaoMin / 10) * intensidade * MULTIPLICADORES[tipo];
  return Number(carga.toFixed(2));
}

module.exports = { calcularCarga, MULTIPLICADORES };
