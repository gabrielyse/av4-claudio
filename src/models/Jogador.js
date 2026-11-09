const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Jogador', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'O nome é obrigatório.' },
        notEmpty: { msg: 'O nome é obrigatório.' },
      },
    },
    posicao: {
      type: DataTypes.ENUM('G', 'Z', 'M', 'A'),
      allowNull: false,
      validate: {
        notNull: { msg: 'A posição é obrigatória.' },
        isIn: { args: [['G', 'Z', 'M', 'A']], msg: 'Posição inválida. Use G, Z, M ou A.' },
      },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'jogadores',
  });
};
