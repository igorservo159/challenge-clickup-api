import { Task } from '../../../domain/entities/Task.js';

export class SyncAndGetAllTasksUseCase {
  #clickUpService;
  #taskRepository;

  constructor(clickUpService, taskRepository) {
    this.#clickUpService = clickUpService;
    this.#taskRepository = taskRepository;
  }

  async execute() {
    const clickUpTasks = await this.#clickUpService.getTasksFromList();

    for (const clickUpTask of clickUpTasks) {
      const status = clickUpTask.status ? clickUpTask.status.status : 'to do';
      const dueDate = clickUpTask.due_date ? new Date(parseInt(clickUpTask.due_date)) : null;
      const dateCreated = clickUpTask.date_created ? new Date(parseInt(clickUpTask.date_created)) : null;

      const taskEntity = new Task({
        id: clickUpTask.id,
        name: clickUpTask.name,
        description: clickUpTask.description || null,
        status: status,
        dueDate: dueDate,
        dateCreated: dateCreated
      });

      await this.#taskRepository.save(taskEntity);
    }

    return this.#taskRepository.findAll();
  }
}
