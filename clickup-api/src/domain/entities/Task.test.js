import { Task } from './Task.js';
import { describe, test, expect } from '@jest/globals';

describe('Domain Entity: Task', () => {
  test('should create a task instance successfully with required properties', () => {
    const taskProps = {
      id: 'task-123',
      name: 'Resolver bug na tela de login',
      description: 'O botão de login não está funcionando no Safari.',
      status: 'in progress',
      dueDate: new Date('2025-12-31T23:59:59Z')
    };

    const task = new Task(taskProps);

    expect(task).toBeInstanceOf(Task);
    expect(task.id).toBe('task-123');
    expect(task.name).toBe('Resolver bug na tela de login');
    expect(task.status).toBe('in progress');
  });

  test('should throw an error if name is not provided', () => {
    expect(() => {
      new Task({ name: '' });
    }).toThrow('O nome da tarefa é obrigatório.');

    expect(() => {
      new Task({});
    }).toThrow('O nome da tarefa é obrigatório.');
  });

  test('should use default values for optional properties', () => {
    const task = new Task({ name: 'Nova Tarefa Padrão' });

    expect(task.id).toBeNull();
    expect(task.description).toBeNull();
    expect(task.status).toBe('to do');
    expect(task.dueDate).toBeNull();
    expect(task.dateCreated).toBeInstanceOf(Date);
  });

  test('should update the task status correctly', () => {
    const task = new Task({ name: 'Minha Tarefa' });
    task.updateStatus('done');
    expect(task.status).toBe('done');
  });

  test('isOverdue should return true if the due date is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const task = new Task({ name: 'Tarefa Atrasada', dueDate: pastDate });
    expect(task.isOverdue()).toBe(true);
  });

  test('isOverdue should return false if the due date is in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const task = new Task({ name: 'Tarefa no Prazo', dueDate: futureDate });
    expect(task.isOverdue()).toBe(false);
  });

  test('isOverdue should return false if there is no due date', () => {
    const task = new Task({ name: 'Tarefa sem Prazo' });
    expect(task.isOverdue()).toBe(false);
  });
});
