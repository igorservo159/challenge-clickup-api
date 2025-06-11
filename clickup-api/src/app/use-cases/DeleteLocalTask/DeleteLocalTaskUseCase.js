import { NotFoundError } from '../../../core/errors/NotFoundError.js';

export class DeleteLocalTaskUseCase {
  #taskRepository;

  constructor(taskRepository) {
    this.#taskRepository = taskRepository;
  }

  async execute(taskId) {
    const taskToDelete = await this.#taskRepository.findById(taskId);

    if (!taskToDelete) {
      throw new NotFoundError(`A tarefa com o ID ${taskId} não foi encontrada.`);
    }

    await this.#taskRepository.deleteById(taskId);
  }
}
