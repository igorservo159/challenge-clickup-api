export class GetAllLocalTasksUseCase {
  #taskRepository;

  constructor(taskRepository) {
    this.#taskRepository = taskRepository;
  }

  async execute() {
    return this.#taskRepository.findAll();
  }
}
