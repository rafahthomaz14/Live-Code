
// Classe Task representa uma tarefa com um identificador único e um nome.
class Task {
    constructor(id, name) {
        this.id = id;      // ID da tarefa, único para cada tarefa.
        this.name = name;  // Nome da tarefa.
    }
}

// Classe TaskManager é responsável por gerenciar as tarefas.
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();  // Carrega as tarefas do localStorage ao inicializar.
    }

    // Método para carregar as tarefas armazenadas no localStorage.
    loadTasks() {
        const tasks = localStorage.getItem('tasks');  // Tenta obter as tarefas do localStorage.
        return tasks ? JSON.parse(tasks) : [];  // Se existirem tarefas, converte de JSON para objeto. Se não, retorna um array vazio.
    }

    // Método para salvar as tarefas no localStorage.
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));  // Converte as tarefas em JSON e armazena no localStorage.
    }

    // Método para adicionar uma nova tarefa.
    addTask(taskName) {
        // Cria uma nova tarefa com um ID único (timestamp) e o nome fornecido.
        const newTask = new Task(Date.now(), taskName);
        this.tasks.push(newTask);  // Adiciona a nova tarefa ao array de tarefas.
        this.saveTasks();  // Salva as tarefas atualizadas no localStorage.
    }

    // Método para remover uma tarefa pelo ID.
    removeTask(taskId) {
        var res = confirm('Deseja apagar essa tarefa?')
        if (res) {
            // Filtra as tarefas, mantendo apenas as que não correspondem ao ID da tarefa a ser removida.
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();  // Salva as tarefas atualizadas no localStorage.
        }


    }

    // Método para editar o nome de uma tarefa existente.
    editTask(taskId, newTaskName) {
        // Encontra a tarefa correspondente ao ID fornecido.
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.name = newTaskName;  // Atualiza o nome da tarefa.
            this.saveTasks();  // Salva as tarefas atualizadas no localStorage.
        }
    }

    // Método para obter todas as tarefas.
    getTasks() {
        return this.tasks;  // Retorna o array de tarefas.
    }
}

// Quando o documento estiver pronto (carregado), execute a função a seguir.
$(document).ready(function () {
    const taskManager = new TaskManager();  // Cria uma nova instância do gerenciador de tarefas.

    // Função para renderizar as tarefas na lista.
    function renderTasks() {
        $('#taskList').empty();  // Limpa a lista de tarefas existente.
        taskManager.getTasks().forEach(task => {
            // Adiciona cada tarefa à lista, incluindo botões de editar e remover.
            $('#taskList').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="task-name">${task.name}</span>
                    <div>
                        <button class="btn btn-primary btn-sm editTask" data-id="${task.id}">Editar</button>
                        <button class="btn btn-danger btn-sm removeTask" data-id="${task.id}">Remover</button>
                    </div>
                </li>
            `);
        });

    }

    // Ao clicar no botão "Adicionar Tarefa".
    $('#addTask').click(function () {
        const taskName = $('#taskInput').val().trim();  // Obtém o nome da tarefa do input e remove espaços em branco.
        if (taskName) {  // Verifica se o nome da tarefa não está vazio.
            taskManager.addTask(taskName);  // Adiciona a nova tarefa ao gerenciador.
            $('#taskInput').val('');  // Limpa o campo de entrada.
            renderTasks();  // Atualiza a lista de tarefas renderizadas.
        }
    });

    // Ao clicar no botão "Remover" de uma tarefa.
    $('#taskList').on('click', '.removeTask', function () {
        const taskId = Number($(this).data('id'));  // Obtém o ID da tarefa a partir do botão clicado.
        taskManager.removeTask(taskId);  // Remove a tarefa do gerenciador.
        renderTasks();  // Atualiza a lista de tarefas renderizadas.
    });

    // Ao clicar no botão "Editar" de uma tarefa.
    $('#taskList').on('click', '.editTask', function () {
        const taskId = Number($(this).data('id'));  // Obtém o ID da tarefa a partir do botão clicado.
        const taskName = $(this).siblings('.task-name').text();  // Obtém o nome da tarefa que será editada.
        const newTaskName = prompt("Editar Tarefa", taskName);  // Solicita ao usuário um novo nome para a tarefa.
        if (newTaskName) {  // Verifica se o usuário forneceu um novo nome.
            taskManager.editTask(taskId, newTaskName);  // Atualiza o nome da tarefa no gerenciador.
            renderTasks();  // Atualiza a lista de tarefas renderizadas.
        }
    });

    renderTasks();  // Renderiza as tarefas na inicialização da página.
});
