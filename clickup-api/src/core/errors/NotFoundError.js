import { ApplicationError } from './ApplicationError.js';

// Recurso não encontrado (404)
export class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'O recurso solicitado não foi encontrado.', 404);
  }
}
