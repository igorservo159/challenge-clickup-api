import { Router } from 'express';

export function createTaskRoutes(taskController) {
  const taskRoutes = Router();

  taskRoutes.get('/', (req, res, next) => taskController.getAll(req, res, next));
  taskRoutes.post('/', (req, res, next) => taskController.create(req, res, next));
  taskRoutes.delete('/:id', (req, res, next) => taskController.deleteLocal(req, res, next));

  return taskRoutes;
}
