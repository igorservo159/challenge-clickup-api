import { promises as fs } from 'fs';
import path from 'path';
import { ITaskRepository } from '../../../app/repositories/ITaskRepository.js';
import { Task } from '../../../domain/entities/Task.js';

const dbPath = path.resolve(process.cwd(), 'database', 'database.json');

export class JsonFileTaskRepository extends ITaskRepository {
  constructor() {
    super();
    this.#initializeDatabase();
  }

  async #initializeDatabase() {
    try {
      const dbDir = path.dirname(dbPath);
      await fs.mkdir(dbDir, { recursive: true });
      await fs.access(dbPath);
    } catch (error) {
      // Se o arquivo não existir, cria um array vazio
      await fs.writeFile(dbPath, JSON.stringify([], null, 2));
    }
  }

  async #readDatabase() {
    const fileContent = await fs.readFile(dbPath, { encoding: 'utf-8' });
    const tasksData = JSON.parse(fileContent);
    return tasksData.map(taskData => new Task(taskData));
  }

  async #writeDatabase(tasks) {
    const dataToWrite = JSON.stringify(tasks, null, 2);
    await fs.writeFile(dbPath, dataToWrite);
  }

  async save(task) {
    const tasks = await this.#readDatabase();
    const taskIndex = tasks.findIndex(t => t.id === task.id);

    if (taskIndex > -1) {
      tasks[taskIndex] = task;
    } else {
      tasks.push(task);
    }

    await this.#writeDatabase(tasks);
    return task;
  }

  async findById(id) {
    const tasks = await this.#readDatabase();
    return tasks.find(t => t.id === id) || null;
  }

  async findAll() {
    return this.#readDatabase();
  }

  async deleteById(id) {
    let tasks = await this.#readDatabase();
    const initialLength = tasks.length;

    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length < initialLength) {
      await this.#writeDatabase(tasks);
    }
  }

  async clearAll() {
    await this.#writeDatabase([]);
  }
}
