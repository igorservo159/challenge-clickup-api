import { Router } from 'express';

export function createStorageRoutes(storageController) {
  const storageRoutes = Router();

  storageRoutes.get('/', (req, res, next) => storageController.getAll(req, res, next));
  storageRoutes.delete('/', (req, res, next) => storageController.deleteAll(req, res, next));

  return storageRoutes;
}
