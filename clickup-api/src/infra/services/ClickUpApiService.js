import { IClickUpService } from '../../app/services/IClickUpService.js';
import { ServiceError } from '../../core/errors/ServiceError.js';

export class ClickUpApiService extends IClickUpService {
  #apiUrl;
  #personalToken;
  #listId;

  constructor({ apiUrl, personalToken, listId }) {
    super();
    this.#apiUrl = apiUrl;
    this.#personalToken = personalToken;
    this.#listId = listId;
  }

  async getTasksFromList() {
    const url = `${this.#apiUrl}/list/${this.#listId}/task`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': this.#personalToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Erro ao buscar tarefas do ClickUp: ${response.status}`);
      if (response.status === 401) {
        throw new ServiceError('Token do ClickUp inválido ou sem permissão.', 401);
      }
      throw new ServiceError(`Falha na comunicação com a API do ClickUp: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.tasks;
  }

  async createTask(taskData) {
    const url = `${this.#apiUrl}/list/${this.#listId}/task`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': this.#personalToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      console.error(`Erro ao criar tarefa no ClickUp: ${response.status}`);
      if (response.status === 401) {
        throw new ServiceError('Token do ClickUp inválido ou sem permissão.', 401);
      }
      throw new ServiceError(`Falha ao criar tarefa no ClickUp: ${response.statusText}`, response.status);
    }

    return response.json();
  }
}
