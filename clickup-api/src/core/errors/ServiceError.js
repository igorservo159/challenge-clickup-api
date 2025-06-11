import { ApplicationError } from './ApplicationError.js';

// Falhas de comunicação com serviços externos
export class ServiceError extends ApplicationError {
  constructor(message, statusCode = 503) {
    super(message || 'O serviço externo está indisponível.', statusCode);
  }
}
