// Apenas das ações relacionadas ao armazenamento local.
export class StorageController {
  #getAllLocalTasksUseCase;
  #clearAllLocalTasksUseCase;

  constructor(getAllLocalTasksUseCase, clearAllLocalTasksUseCase) {
    this.#getAllLocalTasksUseCase = getAllLocalTasksUseCase;
    this.#clearAllLocalTasksUseCase = clearAllLocalTasksUseCase;
  }

  async getAll(req, res, next) {
    try {
      const localTasks = await this.#getAllLocalTasksUseCase.execute();
      res.status(200).json(localTasks);
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(req, res, next) {
    try {
      await this.#clearAllLocalTasksUseCase.execute();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
