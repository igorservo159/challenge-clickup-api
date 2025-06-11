const API_BASE_URL = 'http://localhost:3000';

// Elementos da página
const dataContainer = document.getElementById('data-container');
const createTaskForm = document.getElementById('create-task-form');
const syncButton = document.getElementById('sync-btn');
const localRefreshButton = document.getElementById('local-refresh-btn');
const clearAllButton = document.getElementById('clear-local-btn');

/**
 * Formata uma data para o padrão pt-BR.
 * @param {string | null} dateString
 * @returns {string}
 */
function formatDate(dateString) {
  if (!dateString) {
    return 'Não definida';
  }
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

/**
 * Renderiza a lista de tarefas na tela.
 * @param {Array} tasks
 */
function renderTasks(tasks) {
  dataContainer.innerHTML = '';
  dataContainer.classList.remove('empty');

  if (!tasks || tasks.length === 0) {
    dataContainer.textContent = 'Nenhuma tarefa encontrada no armazenamento local.';
    dataContainer.classList.add('empty');
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';

    card.innerHTML = `
      <div class="task-content">
        <h4>${task.name}</h4>
        <p><strong>ID:</strong> ${task.id}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <p>${task.description || 'Sem descrição.'}</p>
        <p class="task-dates">
          <span><strong>Criada em:</strong> ${formatDate(task.dateCreated)}</span>
          <span><strong>Vencimento:</strong> ${formatDate(task.dueDate)}</span>
        </p>
      </div>
      <button class="delete-btn" data-task-id="${task.id}">Excluir</button>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      handleDeleteTask(task.id);
    });

    dataContainer.appendChild(card);
  });
}

async function handleClearAll() {
  const userInput = prompt("ATENÇÃO: Isso irá apagar TODAS as tarefas do armazenamento local. A ação não pode ser desfeita.\n\nDigite 'CONFIRMAR' para prosseguir.");

  if (userInput !== 'CONFIRMAR') {
    alert('Operação cancelada.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/storage`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Falha ao limpar o armazenamento.');
    }
    alert('Armazenamento local limpo com sucesso!');
    fetchLocalTasks();
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
}

async function handleDeleteTask(taskId) {
  if (!confirm(`Tem certeza que deseja excluir a tarefa ${taskId} do armazenamento local? Esta ação não afeta o ClickUp.`)) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || 'Erro ao excluir tarefa.');
    }
    alert('Tarefa excluída localmente com sucesso!');
    fetchLocalTasks();
  } catch (error) {
    console.error('Erro ao excluir:', error);
    alert(`Erro: ${error.message}`);
  }
}

async function fetchLocalTasks() {
  dataContainer.innerHTML = "Buscando dados locais...";
  dataContainer.classList.add('empty');
  try {
    const response = await fetch(`${API_BASE_URL}/api/storage`);
    if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas locais:", error);
    dataContainer.textContent = "Erro ao buscar dados do servidor.";
  }
}

async function syncWithClickUp() {
  dataContainer.innerHTML = "Sincronizando com a API do ClickUp...";
  dataContainer.classList.add('empty');
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Erro ao sincronizar com ClickUp:", error);
    dataContainer.textContent = "Erro ao sincronizar com o ClickUp.";
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(createTaskForm);
  const taskData = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    startDate: formData.get('startDate') || undefined,
    dueDate: formData.get('dueDate') || undefined
  };
  const createButton = document.getElementById('create-btn');
  createButton.textContent = 'Criando...';
  createButton.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || 'Erro ao criar tarefa.');
    }
    alert('Tarefa criada com sucesso!');
    createTaskForm.reset();
    localRefreshButton.click();
  } catch (error) {
    console.error('Erro no formulário:', error);
    alert(`Erro: ${error.message}`);
  } finally {
    createButton.textContent = 'Criar Tarefa';
    createButton.disabled = false;
  }
}

// Inicialização dos eventos da página
syncButton.addEventListener('click', syncWithClickUp);
localRefreshButton.addEventListener('click', fetchLocalTasks);
createTaskForm.addEventListener('submit', handleFormSubmit);
clearAllButton.addEventListener('click', handleClearAll);
window.addEventListener('load', fetchLocalTasks);
