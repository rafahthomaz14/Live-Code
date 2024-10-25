$(document).ready(function () {
  const confirmClass = new ConfirmClass();
  const taskManager = new TaskManager();
  const modalComponet = new ModalComponet();

  $(".modalComponet, .fecharModal").on("click", function () {
    $(this).addClass("d-none");
  });

  function renderGroups() {
    $("#groupList").empty();
    taskManager.getGroups().forEach((group) => {
      $("#groupList").append(`
        <div class="group col-12 col-xl-6 mt-2 p-1 ">
            <div class="border rounded p-1">

                <div class="ficarFixo position-sticky t-0">
                    <h4 class="text-center">${group.name}</h4>

                    <input type="text" class="taskInput taskInput${group.id}  form-control bg-light" placeholder="Nova tarefa...">
                </div>

                
                <div class="modal-footer">
                    <button class="btn btn-primary addTask" data-groupid="${group.id}">Adicionar Tarefa</button>
                </div>
                
                <ul class="taskList" id="taskList-${group.id}"></ul>
                
                <div class="modal-footer position-sticky b-0">
                    <button class="btn btn-warning editarGroup text-white" data-groupid="${group.id}">Editar</button>
                    <button class="btn btn-danger removeGroup" data-groupid="${group.id}">Remover Grupo</button>
                </div>

            </div>
        </div>`);

      group.tasks.forEach((task) => {
        $(`#taskList-${group.id}`).append(`
            <li class="mt-2 rounded list-group-item d-flex justify-content-between align-items-center">
                <span class="task-name${task.id}">${task.name}</span>
                <div>
                    <button class="btn btn-warning btn-sm editTask" data-groupid="${group.id}" data-id="${task.id}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger btn-sm removeTask" data-groupid="${group.id}" data-id="${task.id}"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-danger btn-sm infoTask" data-groupid="${group.id}" data-id="${task.id}"><i class="bi bi-info-circle"></i></button>
                </div>
            </li>
        `);
      });
    });
  }

  $("#addGroup").click(function () {
    const groupName = $("#groupInput").val().trim();
    if (groupName) {
      taskManager.addGroup(groupName);
      $("#groupInput").val("");
      renderGroups();
    }
  });

  $("#groupList").on("click", ".addTask", function () {
    const groupId = Number($(this).data("groupid"));
    const taskName = $(`#groupList .taskInput${groupId}`).val().trim();
    if (taskName) {
      taskManager.addTaskToGroup(groupId, taskName);
      $(this).siblings(".taskInput").val("");
      renderGroups();
    }
  });

  $("#groupList").on("click", ".removeTask", function () {
    const groupId = Number($(this).data("groupid"));
    const taskId = Number($(this).data("id"));
    taskManager.removeTaskFromGroup(groupId, taskId);
    renderGroups();
  });

  $("#groupList").on("click", ".infoTask", function () {
    const groupId = Number($(this).data("groupid"));
    const taskId = Number($(this).data("id"));
    const taskName = $(`#taskList-${groupId} .task-name${taskId}`).text();
    taskManager.getGroupsId(groupId, taskName, groupId);
  });

  $("#groupList").on("click", ".editTask", function () {
    const groupId = Number($(this).data("groupid"));
    const taskId = Number($(this).data("id"));
    const taskName = $(`#taskList-${groupId} .task-name${taskId}`).text();
    const newTaskName = prompt("Editar Tarefa", taskName);
    if (newTaskName) {
      taskManager.editTaskInGroup(groupId, taskId, newTaskName);
      renderGroups();
    }
  });

  $("#groupList").on("click", ".removeGroup", function () {
    if (confirmClass.confirmBox("Deseja apagar Grupo?")) {
      const groupId = Number($(this).data("groupid"));

      var children = taskManager.groups.find((group) => group.id == groupId);

      if (children.tasks.length > 0) {
        modalComponet.modal("Existe tarefas vinculadas, Grupo nao pode ser apagado!", "Aviso");
      } else {
        taskManager.groups = taskManager.groups.filter((group) => group.id !== groupId);
        taskManager.saveGroups();
        renderGroups();
      }
    }
  });

  renderGroups();
});
