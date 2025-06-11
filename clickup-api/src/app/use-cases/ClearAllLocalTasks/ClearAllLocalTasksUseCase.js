export class ClearAllLocalTasksUseCase {
  #taskRepository;

  constructor(taskRepository) {
    this.#taskRepository = taskRepository;
  }

  async execute() {
    await this.#taskRepository.clearAll();
  }
}
