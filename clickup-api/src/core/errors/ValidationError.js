import { ApplicationError } from './ApplicationError.js';

// Dados de entrada inválidos (400)
export class ValidationError extends ApplicationError {
  constructor(message) {
    super(message || 'Dados da requisição inválidos.', 400);
  }
}
