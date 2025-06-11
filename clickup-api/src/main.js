import { startServer } from './infra/http/server.js';
import { config } from './infra/config/index.js';

import { ClickUpApiService } from './infra/services/ClickUpApiService.js';
import { JsonFileTaskRepository } from './infra/database/json-file/JsonFileTaskRepository.js';

import { SyncAndGetAllTasksUseCase } from './app/use-cases/SyncAndGetAllTasks/SyncAndGetAllTasksUseCase.js';
import { CreateTaskUseCase } from './app/use-cases/CreateTask/CreateTaskUseCase.js';
import { DeleteLocalTaskUseCase } from './app/use-cases/DeleteLocalTask/DeleteLocalTaskUseCase.js';
import { GetAllLocalTasksUseCase } from './app/use-cases/GetAllLocalTasks/GetAllLocalTasksUseCase.js';
import { ClearAllLocalTasksUseCase } from './app/use-cases/ClearAllLocalTasks/ClearAllLocalTasksUseCase.js';

import { TaskController } from './infra/http/controllers/TaskController.js';
import { StorageController } from './infra/http/controllers/StorageController.js';

import { createTaskRoutes } from './infra/http/routes/task.routes.js';
import { createStorageRoutes } from './infra/http/routes/storage.routes.js';

// Adapters
const clickUpService = new ClickUpApiService(config.clickup);
const taskRepository = new JsonFileTaskRepository();

// Use Cases
const syncAndGetAllTasksUseCase = new SyncAndGetAllTasksUseCase(clickUpService, taskRepository);
const createTaskUseCase = new CreateTaskUseCase(clickUpService, taskRepository);
const deleteLocalTaskUseCase = new DeleteLocalTaskUseCase(taskRepository);
const getAllLocalTasksUseCase = new GetAllLocalTasksUseCase(taskRepository);
const clearAllLocalTasksUseCase = new ClearAllLocalTasksUseCase(taskRepository);

// Controllers & Routes
const taskController = new TaskController(
  syncAndGetAllTasksUseCase,
  createTaskUseCase,
  deleteLocalTaskUseCase,
);
const taskRouter = createTaskRoutes(taskController);

const storageController = new StorageController(
  getAllLocalTasksUseCase,
  clearAllLocalTasksUseCase
);
const storageRouter = createStorageRoutes(storageController);

const port = config.api.port;

startServer(port, { taskRouter, storageRouter });
