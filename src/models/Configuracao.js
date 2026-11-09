const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Configuracao', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cargaMaximaSemanal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: 'A carga máxima semanal é obrigatória.' },
        isDecimal: { msg: 'A carga máxima semanal deve ser numérica.' },
        min: { args: [0.01], msg: 'A carga máxima semanal deve ser positiva.' },
      },
      get() {
        const valor = this.getDataValue('cargaMaximaSemanal');
        return valor === null || valor === undefined ? valor : Number(valor);
      },
    },
    dataVigencia: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'configuracoes',
  });
};
