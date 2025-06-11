export class TaskController {
  #syncAndGetAllTasksUseCase;
  #createTaskUseCase;
  #deleteLocalTaskUseCase;

  constructor(syncAndGetAllTasksUseCase, createTaskUseCase, deleteLocalTaskUseCase) {
    this.#syncAndGetAllTasksUseCase = syncAndGetAllTasksUseCase;
    this.#createTaskUseCase = createTaskUseCase;
    this.#deleteLocalTaskUseCase = deleteLocalTaskUseCase;
  }

  async getAll(req, res, next) {
    try {
      const tasks = await this.#syncAndGetAllTasksUseCase.execute();
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const taskData = req.body;
      const newTask = await this.#createTaskUseCase.execute(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }

  async deleteLocal(req, res, next) {
    try {
      const { id } = req.params;
      await this.#deleteLocalTaskUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
