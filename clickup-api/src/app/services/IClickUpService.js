// Interface que define as operações para o serviço do ClickUp
export class IClickUpService {
  async getTasksFromList() {
    throw new Error("MÉTODO 'getTasksFromList' NÃO IMPLEMENTADO");
  }

  async createTask(taskData) {
    throw new Error("MÉTODO 'createTask' NÃO IMPLEMENTADO");
  }
}
