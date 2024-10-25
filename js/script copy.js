// Classe Task representa uma tarefa com um identificador único e um nome.
var confirmClass = new ConfirmClass();
class Task {
    constructor(id, name) {
        this.id = id;      // ID da tarefa, único para cada tarefa.
        this.name = name;  // Nome da tarefa.
    }
}

// Classe Group representa um grupo de tarefas.
class Group {
    constructor(id, name) {
        this.id = id;        // ID do grupo, único para cada grupo.
        this.name = name;    // Nome do grupo.
        this.tasks = [];     // Array que contém as tarefas deste grupo.
    }

    // Método para adicionar uma tarefa ao grupo.
    addTask(task) {
        this.tasks.push(task);
    }

    // Método para remover uma tarefa do grupo.
    removeTask(taskId) {
        if(confirmClass.confirmBox('Deseja apagar taks?')){
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        } 
    }

    // Método para editar uma tarefa no grupo.
    editTask(taskId, newTaskName) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.name = newTaskName;
        }
    }
}

// Classe TaskManager é responsável por gerenciar grupos e suas tarefas.
class TaskManager {
    constructor() {
        this.groups = this.loadGroups();  // Carrega os grupos do localStorage ao inicializar.
    }

    // Método para carregar os grupos armazenados no localStorage.
    loadGroups() {
        const groups = localStorage.getItem('groups');  // Tenta obter os grupos do localStorage.
        return groups ? JSON.parse(groups).map(groupData => {
            const group = new Group(groupData.id, groupData.name);
            group.tasks = groupData.tasks.map(taskData => new Task(taskData.id, taskData.name)); // Recria as tarefas do grupo
            return group;
        }) : [];  // Se existirem grupos, converte de JSON para objetos. Se não, retorna um array vazio.
    }

    // Método para salvar os grupos no localStorage.
    saveGroups() {
        localStorage.setItem('groups', JSON.stringify(this.groups));  // Converte os grupos em JSON e armazena no localStorage.
    }

    // Método para adicionar um novo grupo.
    addGroup(groupName) {
        const newGroup = new Group(Date.now(), groupName);  // Cria um novo grupo com um ID único e o nome fornecido.
        this.groups.push(newGroup);  // Adiciona o novo grupo ao array de grupos.
        this.saveGroups();  // Salva os grupos atualizados no localStorage.
    }

    // Método para adicionar uma tarefa a um grupo.
    addTaskToGroup(groupId, taskName) {
        const group = this.groups.find(group => group.id === groupId);
        if (group) {
            const newTask = new Task(Date.now(), taskName); // Cria uma nova tarefa.
            group.addTask(newTask);  // Adiciona a nova tarefa ao grupo.
            this.saveGroups();  // Salva os grupos atualizados no localStorage.
        }
    }

    // Método para remover uma tarefa de um grupo.
    removeTaskFromGroup(groupId, taskId) {
        const group = this.groups.find(group => group.id === groupId);
        if (group) {
            group.removeTask(taskId);  // Remove a tarefa do grupo.
            this.saveGroups();  // Salva os grupos atualizados no localStorage.
        }
    }

    // Método para editar uma tarefa em um grupo.
    editTaskInGroup(groupId, taskId, newTaskName) {
        const group = this.groups.find(group => group.id === groupId);
        if (group) {
            group.editTask(taskId, newTaskName);  // Edita a tarefa no grupo.
            this.saveGroups();  // Salva os grupos atualizados no localStorage.
        }
    }

    // Método para obter todos os grupos.
    getGroups() {
        return this.groups;  // Retorna o array de grupos.
    }
}

// Quando o documento estiver pronto (carregado), execute a função a seguir.
$(document).ready(function () {
    const taskManager = new TaskManager();  // Cria uma nova instância do gerenciador de tarefas.

    // Função para renderizar grupos e suas tarefas na lista.
    function renderGroups() {
        $('#groupList').empty();  // Limpa a lista de grupos existente.
        taskManager.getGroups().forEach(group => {
            // Adiciona cada grupo à lista.
            $('#groupList').append(`
                <div class="group col-6 border rounded">
                    <h4>${group.name}</h4>
                    <input type="text" class="taskInput" placeholder="Nova tarefa...">
                    <button class="btn btn-primary addTask" data-groupid="${group.id}">Adicionar Tarefa</button>
                    <ul class="taskList" id="taskList-${group.id}">
                    </ul>
                    <button class="btn btn-danger removeGroup" data-groupid="${group.id}">Remover Grupo</button>
                </div>
            `);

            // Renderiza as tarefas do grupo.
            group.tasks.forEach(task => {
                $(`#taskList-${group.id}`).append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="task-name">${task.name}</span>
                        <div>
                            <button class="btn btn-warning btn-sm editTask" data-groupid="${group.id}" data-id="${task.id}">Editar</button>
                            <button class="btn btn-danger btn-sm removeTask" data-groupid="${group.id}" data-id="${task.id}">Remover</button>
                        </div>
                    </li>
                `);
            });
        });
    }

    // Ao clicar no botão "Adicionar Grupo".
    $('#addGroup').click(function () {
        const groupName = $('#groupInput').val().trim();  // Obtém o nome do grupo do input e remove espaços em branco.
        if (groupName) {  // Verifica se o nome do grupo não está vazio.
            taskManager.addGroup(groupName);  // Adiciona o novo grupo ao gerenciador.
            $('#groupInput').val('');  // Limpa o campo de entrada.
            renderGroups();  // Atualiza a lista de grupos renderizadas.
        }
    });

    // Ao clicar no botão "Adicionar Tarefa" dentro de um grupo.
    $('#groupList').on('click', '.addTask', function () {
        const groupId = Number($(this).data('groupid'));  // Obtém o ID do grupo a partir do botão clicado.
        const taskName = $(this).siblings('.taskInput').val().trim();  // Obtém o nome da tarefa do input.
        if (taskName) {  // Verifica se o nome da tarefa não está vazio.
            taskManager.addTaskToGroup(groupId, taskName);  // Adiciona a nova tarefa ao grupo.
            $(this).siblings('.taskInput').val('');  // Limpa o campo de entrada.
            renderGroups();  // Atualiza a lista de grupos renderizadas.
        }
    });

    // Ao clicar no botão "Remover" de uma tarefa dentro de um grupo.
    $('#groupList').on('click', '.removeTask', function () {
        const groupId = Number($(this).data('groupid'));  // Obtém o ID do grupo a partir do botão clicado.
        const taskId = Number($(this).data('id'));  // Obtém o ID da tarefa a partir do botão clicado.
        taskManager.removeTaskFromGroup(groupId, taskId);  // Remove a tarefa do grupo.
        renderGroups();  // Atualiza a lista de grupos renderizadas.
    });

    // Ao clicar no botão "Editar" de uma tarefa dentro de um grupo.
    $('#groupList').on('click', '.editTask', function () {
        const groupId = Number($(this).data('groupid'));  // Obtém o ID do grupo a partir do botão clicado.
        const taskId = Number($(this).data('id'));  // Obtém o ID da tarefa a partir do botão clicado.
        const taskName = $(this).siblings('.task-name').text();  // Obtém o nome da tarefa que será editada.
        const newTaskName = prompt("Editar Tarefa", taskName);  // Solicita ao usuário um novo nome para a tarefa.
        if (newTaskName) {  // Verifica se o usuário forneceu um novo nome.
            taskManager.editTaskInGroup(groupId, taskId, newTaskName);  // Atualiza o nome da tarefa no grupo.
            renderGroups();  // Atualiza a lista de grupos renderizadas.
        }
    });

    // Ao clicar no botão "Remover Grupo".
    $('#groupList').on('click', '.removeGroup', function () {
        if(confirmClass.confirmBox('Deseja apagar Grupo?')){
            const groupId = Number($(this).data('groupid'));  // Obtém o ID do grupo a partir do botão clicado.   
            taskManager.groups = taskManager.groups.filter(group => group.id !== groupId);  // Remove o grupo do gerenciador.
            taskManager.saveGroups();  // Salva os grupos atualizados no localStorage.
            renderGroups();  // Atualiza a lista de grupos renderizadas.
        }
    });

    renderGroups();  // Renderiza os grupos na inicialização da página.
});
