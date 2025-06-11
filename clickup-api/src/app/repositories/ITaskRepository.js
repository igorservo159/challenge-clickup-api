import { Task } from '../../domain/entities/Task.js';

// Interface que define as operações para um repositório de tarefas
export class ITaskRepository {
  async save(task) {
    throw new Error("MÉTODO 'save' NÃO IMPLEMENTADO");
  }

  async findById(id) {
    throw new Error("MÉTODO 'findById' NÃO IMPLEMENTADO");
  }

  async findAll() {
    throw new Error("MÉTODO 'findAll' NÃO IMPLEMENTADO");
  }

  async deleteById(id) {
    throw new Error("MÉTODO 'deleteById' NÃO IMPLEMENTADO");
  }

  async clearAll() {
    throw new Error("MÉTODO 'clearAll' NÃO IMPLEMENTADO");
  }
}
