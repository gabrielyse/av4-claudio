// Erro com código HTTP, lançado pelos services e tratado nos controllers.
class AppError extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

module.exports = AppError;
