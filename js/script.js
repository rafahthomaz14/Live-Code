// Classe Task representa uma tarefa com um identificador único e um nome.
class Task {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

// Classe TaskManager é responsável por gerenciar as tarefas.
class TaskManager {
  constructor() {
    this.tasks = this.loadTasks(); // metoda que carrega as tarefas.
  }

  // Método para carregar as tarefas armazenadas no localStorage.
  loadTasks() {
    const tasks = localStorage.getItem("tasks"); // obter as tarefas armazenadas no localStorage.
    return tasks ? JSON.parse(tasks) : []; // se existir tarefas, converte de json para objeto. Se não retorna um array vazio.
  }

  // Método para salvar as tarefas no localStorage.
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks)); // converte as tarefas em json para armazenar no localStorage
  }

  // Método para adicionar uma nova tarefa.
  addTask(taskName) {
    const newTask = new Task(Date.now(), taskName);
    this.tasks.push(newTask); // adicionar uma nova tarefa ao array de tarefas
    this.saveTasks(); // salva as tarefas atualizadas no localStorage.
  }

  // Método para remover uma tarefa pelo ID.
  removeTask(taskId) {
    // pergunta de cofirmação antes de apagar tarefa.
    var res = confirm("Deseja realmente Apagar Tarefa?");
    // faz um filtro mantendo apenas as que nao corresponde ao id selecionado
    if (res) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      this.saveTasks(); // salva as tarefas atualizadas no localStorage.
    }
  }

  // Método para editar o nome de uma tarefa existente.
  editTask(taskId, newTaskName) {
    // Encontrar tarefa correspondente ao ID fornecido.
    const task = this.tasks.find((task) => task.id == taskId);
    if (task) {
      task.name = newTaskName;
      this.saveTasks(); // salva as tarefas atualizadas no localStorage.
    }
  }

  // Método para obter todas as tarefas.
  getTasks() {
    return this.tasks;
  }
}

// Quando o documento estiver pronto (carregado), execute a função a seguir.
$(document).ready(function () {
  // criar uma nova instância do gerenciado de páginas
  const taskManager = new TaskManager();

  // Função para renderizar as tarefas na lista.
  function renderTasks() {
    // limpa a lista de tarefas existes para poder construir uma nova.
    $("#taskList").empty();
    // adicionar uma lista de tarefas, incluido os botões de editar e apagar
    taskManager.getTasks().forEach((task) => {
      $("#taskList").append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span id="task-name${task.id}" class="task-name">${task.name}</span>

                <div>
                    <button class="btn btn-primary btn-sm editTask" data-id="${task.id}">Editar</button>
                    <button class="btn btn-danger btn-sm removeTask" data-id="${task.id}">Remover</button>
                </div>
            </li>    
        `);
    });
  }

  // Ao clicar no botão "Adicionar Tarefa".
  $("#addTask").click(() => {
    const taskName = $("#taskInput").val().trim(); // obtem o nome da tarefa digitada e remove os espaços.
    //verificar se o nome da tarefa não esta vazio
    if (taskName) {
      taskManager.addTask(taskName);
      // limpar o campo input(entrada) apos salvar
      $("#taskInput").val("");
      renderTasks(); // atualiza lista rendenrizada.
    }
  });

  // Ao clicar no botão "Remover" de uma tarefa.
  $("#taskList").on("click", ".removeTask", function () {
    const taskId = Number($(this).data("id")); // tranforma em número e obtem o id do botão que foi clicada.
    taskManager.removeTask(taskId);
    renderTasks(); // atualiza lista rendenrizada.
  });

  // Ao clicar no botão "Editar" de uma tarefa.
  $("#taskList").on("click", ".editTask", function () {
    //teste de botão
    const taskId = Number($(this).data("id")); // obtem o id do botao(editar) que foi clicado.
    // obter nome da tarefa para edita-la
    const taskName = $(`#task-name${taskId}`).text();
    //prompt para trocar nome
    const newTaskName = prompt("Editar tarefa", taskName);
    if (newTaskName) {
      taskManager.editTask(taskId, newTaskName); // envia o id da tarefa a ser editada e o novo nome da tarefa.
      renderTasks(); // atualiza lista rendenrizada.
    }
  });

  // Renderiza as tarefas na inicialização da página.
  return renderTasks();
});
