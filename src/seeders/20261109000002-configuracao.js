'use strict';

module.exports = {
  async up(queryInterface) {
    const agora = new Date();
    await queryInterface.bulkInsert('configuracoes', [
      { cargaMaximaSemanal: 200, dataVigencia: new Date('2026-10-01T00:00:00.000Z'), createdAt: agora, updatedAt: agora },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('configuracoes', null, {});
  },
};
