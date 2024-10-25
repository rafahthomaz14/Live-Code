const confirmClass = new ConfirmClass();
const modalComponet = new ModalComponet();


class TaskManager {
  constructor() {
    this.groups = this.loadGroups();
  }

  loadGroups() {
    const groups = localStorage.getItem("groups");
    return groups
      ? JSON.parse(groups).map((groupData) => {
          const group = new Group(groupData.id, groupData.name);
          group.tasks = groupData.tasks.map((taskData) => new Task(taskData.id, taskData.name));
          return group;
        })
      : [];
  }

  saveGroups() {
    localStorage.setItem("groups", JSON.stringify(this.groups));
  }

  addGroup(groupName) {
    const newGroup = new Group(Date.now(), groupName);
    this.groups.push(newGroup);
    this.saveGroups();
  }

  addTaskToGroup(groupId, taskName) {
    const group = this.groups.find((group) => group.id === groupId);
    if (group) {
      const newTask = new Task(Date.now(), taskName);
      group.addTask(newTask);
      this.saveGroups();
    }
  }

  removeTaskFromGroup(groupId, taskId) {
    const group = this.groups.find((group) => group.id === groupId);
    if (group) {
      group.removeTask(taskId);
      this.saveGroups();
    }
  }

  editTaskInGroup(groupId, taskId, newTaskName) {
    const group = this.groups.find((group) => group.id === groupId);
    if (group) {
      group.editTask(taskId, newTaskName);
      this.saveGroups();
    }
  }

  getGroups() {
    return this.groups;
  }

  getGroupsId(groupId, taskName) {

    const groupid = this.groups.find((group) => group.id === groupId);
    if(groupid){
      modalComponet.modal(taskName, groupid.name);
    }

  }
}
