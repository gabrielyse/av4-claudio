const { Sequelize } = require('sequelize');
const config = require('../config/database').development;

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const Jogador = require('./Jogador')(sequelize);
const Treino = require('./Treino')(sequelize);
const Configuracao = require('./Configuracao')(sequelize);

// Associações: um jogador possui vários treinos e cada treino pertence a um jogador.
Jogador.hasMany(Treino, { foreignKey: 'jogadorId' });
Treino.belongsTo(Jogador, { foreignKey: 'jogadorId' });

module.exports = { sequelize, Jogador, Treino, Configuracao };
