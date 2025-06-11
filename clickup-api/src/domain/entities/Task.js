// Tarefa no domínio da aplicação
export class Task {
  id;
  name;
  description;
  status;
  dateCreated;
  dueDate;

  constructor({ id = null, name, description = null, status = 'to do', dateCreated = new Date(), dueDate = null }) {
    if (!name) {
      throw new Error("O nome da tarefa é obrigatório.");
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.dateCreated = dateCreated;
    this.dueDate = dueDate;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
  }

  // Verificar se a tarefa está atrasada
  isOverdue() {
    if (!this.dueDate) {
      return false;
    }
    return this.dueDate < new Date();
  }
}
