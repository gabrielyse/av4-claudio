'use strict';

const { calcularCarga } = require('../utils/calcularCarga');

// [codigo, jogadorId, data, tipo, duracaoMin, intensidade]
// Semana 1: 05/10/2026 (segunda) a 11/10/2026 (domingo) — 12 treinos
// Semana 2: 12/10/2026 (segunda) a 18/10/2026 (domingo) — 8 treinos
const treinos = [
  ['TR001', 1, '2026-10-05', 'F', 60, 8],
  ['TR002', 1, '2026-10-07', 'T', 50, 6],
  ['TR003', 2, '2026-10-05', 'F', 90, 9],
  ['TR004', 2, '2026-10-08', 'F', 60, 8],
  ['TR005', 2, '2026-10-10', 'E', 40, 5],
  ['TR006', 3, '2026-10-06', 'T', 60, 7],
  ['TR007', 3, '2026-10-09', 'E', 60, 4],
  ['TR008', 4, '2026-10-06', 'F', 80, 9],
  ['TR009', 4, '2026-10-08', 'T', 70, 8],
  ['TR010', 4, '2026-10-11', 'E', 50, 6],
  ['TR011', 5, '2026-10-07', 'T', 45, 5],
  ['TR012', 6, '2026-10-09', 'F', 60, 7],
  ['TR013', 1, '2026-10-12', 'E', 60, 5],
  ['TR014', 2, '2026-10-13', 'T', 60, 6],
  ['TR015', 3, '2026-10-12', 'F', 100, 10],
  ['TR016', 3, '2026-10-14', 'F', 60, 8],
  ['TR017', 4, '2026-10-15', 'T', 50, 7],
  ['TR018', 5, '2026-10-13', 'F', 80, 9],
  ['TR019', 5, '2026-10-16', 'T', 60, 8],
  ['TR020', 6, '2026-10-18', 'E', 90, 7],
];

module.exports = {
  async up(queryInterface) {
    const agora = new Date();
    await queryInterface.bulkInsert('treinos', treinos.map(([codigo, jogadorId, data, tipo, duracaoMin, intensidade]) => ({
      codigo,
      jogadorId,
      dataTreino: new Date(`${data}T00:00:00.000Z`),
      tipo,
      duracaoMin,
      intensidade,
      carga: calcularCarga(duracaoMin, intensidade, tipo),
      createdAt: agora,
      updatedAt: agora,
    })));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('treinos', null, {});
  },
};
