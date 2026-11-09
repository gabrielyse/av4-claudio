require('dotenv').config({ quiet: true });
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (erro) {
    // Mensagem genérica: não exibe usuário, senha ou detalhes da conexão.
    console.error('Não foi possível conectar ao banco de dados. Verifique as variáveis do arquivo .env.');
    process.exit(1);
  }
}

iniciar();
