require('dotenv').config({ quiet: true });

// Configuração usada tanto pela aplicação quanto pelo Sequelize CLI (migrations e seeders).
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
