const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Treino', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'O código é obrigatório.' },
        notEmpty: { msg: 'O código é obrigatório.' },
      },
    },
    jogadorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'O jogadorId é obrigatório.' },
      },
    },
    dataTreino: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'A data do treino é obrigatória.' },
        isDate: { msg: 'Data do treino inválida.' },
      },
    },
    tipo: {
      type: DataTypes.ENUM('F', 'T', 'E'),
      allowNull: false,
      validate: {
        notNull: { msg: 'O tipo é obrigatório.' },
        isIn: { args: [['F', 'T', 'E']], msg: 'Tipo inválido. Use F, T ou E.' },
      },
    },
    duracaoMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'A duração é obrigatória.' },
        isInt: { msg: 'A duração deve ser um número inteiro.' },
        min: { args: [1], msg: 'A duração deve ser positiva.' },
      },
    },
    intensidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'A intensidade é obrigatória.' },
        isInt: { msg: 'A intensidade deve ser um número inteiro.' },
        min: { args: [1], msg: 'A intensidade deve estar entre 1 e 10.' },
        max: { args: [10], msg: 'A intensidade deve estar entre 1 e 10.' },
      },
    },
    carga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      // O MySQL devolve DECIMAL como texto; o getter retorna como número.
      get() {
        const valor = this.getDataValue('carga');
        return valor === null || valor === undefined ? valor : Number(valor);
      },
    },
  }, {
    tableName: 'treinos',
  });
};
