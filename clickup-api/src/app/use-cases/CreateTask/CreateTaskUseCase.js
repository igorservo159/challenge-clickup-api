import { Task } from '../../../domain/entities/Task.js';
import { ValidationError } from '../../../core/errors/ValidationError.js';

export class CreateTaskUseCase {
  #clickUpService;
  #taskRepository;

  constructor(clickUpService, taskRepository) {
    this.#clickUpService = clickUpService;
    this.#taskRepository = taskRepository;
  }

  async execute(taskData) {
    if (!taskData.title || taskData.title.trim() === '') {
      throw new ValidationError('O título da tarefa é obrigatório.');
    }

    const clickUpPayload = {
      name: taskData.title,
      description: taskData.description,
      status: taskData.status,
      due_date: taskData.dueDate ? new Date(taskData.dueDate).getTime() : undefined,
      start_date: taskData.startDate ? new Date(taskData.startDate).getTime() : undefined,
    };

    const createdTaskFromClickUp = await this.#clickUpService.createTask(clickUpPayload);

    const newTaskEntity = new Task({
      id: createdTaskFromClickUp.id,
      name: createdTaskFromClickUp.name,
      description: createdTaskFromClickUp.description,
      status: createdTaskFromClickUp.status.status,
      dueDate: createdTaskFromClickUp.due_date ? new Date(parseInt(createdTaskFromClickUp.due_date)) : null,
      dateCreated: createdTaskFromClickUp.date_created ? new Date(parseInt(createdTaskFromClickUp.date_created)) : null,
    });

    await this.#taskRepository.save(newTaskEntity);

    return newTaskEntity;
  }
}
