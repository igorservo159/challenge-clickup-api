// Erros customizados da aplicação
export class ApplicationError extends Error {
  statusCode;

  constructor(message, statusCode = 500) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
