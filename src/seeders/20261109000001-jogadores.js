'use strict';

module.exports = {
  async up(queryInterface) {
    const agora = new Date();
    await queryInterface.bulkInsert('jogadores', [
      { id: 1, nome: 'Carlos Silva', posicao: 'G', ativo: true, createdAt: agora, updatedAt: agora },
      { id: 2, nome: 'Bruno Souza', posicao: 'Z', ativo: true, createdAt: agora, updatedAt: agora },
      { id: 3, nome: 'Rafael Lima', posicao: 'Z', ativo: true, createdAt: agora, updatedAt: agora },
      { id: 4, nome: 'Diego Alves', posicao: 'M', ativo: true, createdAt: agora, updatedAt: agora },
      { id: 5, nome: 'Lucas Pereira', posicao: 'M', ativo: true, createdAt: agora, updatedAt: agora },
      { id: 6, nome: 'Thiago Costa', posicao: 'A', ativo: true, createdAt: agora, updatedAt: agora },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('jogadores', null, {});
  },
};
