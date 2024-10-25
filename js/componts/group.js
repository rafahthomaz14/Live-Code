class Group {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskId) {
    if (confirmClass.confirmBox("Deseja apagar taks?")) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }
  }

  editTask(taskId, newTaskName) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.name = newTaskName;
    }
  }
}
