document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const tasksList = document.getElementById('tasks-list');
  
    let tasksData = [
      { id: 1, title: 'Task 1', description: 'Description for Task 1' },
      { id: 2, title: 'Task 2', description: 'Description for Task 2' },
      { id: 3, title: 'Task 3', description: 'Description for Task 3' }
    ];
  
    // Function to render tasks
    function renderTasks() {
      tasksList.innerHTML = '';
      tasksData.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
          <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
          </div>
          <div class="task-actions">
            <button class="edit-task-btn" data-id="${task.id}">Edit</button>
            <button class="delete-task-btn" data-id="${task.id}">Delete</button>
          </div>
        `;
        tasksList.appendChild(taskItem);
      });
    }
  
    // Initial rendering of tasks
    renderTasks();
  
    // Event listener for task form submission
    taskForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const title = taskTitleInput.value.trim();
      const description = taskDescriptionInput.value.trim();
  
      if (title && description) {
        const newTask = {
          id: tasksData.length + 1,
          title: title,
          description: description
        };
  
        tasksData.push(newTask);
        renderTasks();
  
        // Clear form inputs
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
      }
    });
  
    // Event delegation for Edit and Delete buttons
    tasksList.addEventListener('click', function(event) {
      if (event.target.classList.contains('edit-task-btn')) {
        const taskId = parseInt(event.target.getAttribute('data-id'));
        const taskToEdit = tasksData.find(task => task.id === taskId);
        if (taskToEdit) {
          const newTitle = prompt('Enter new title:', taskToEdit.title);
          if (newTitle) {
            taskToEdit.title = newTitle;
            renderTasks();
          }
        }
      } else if (event.target.classList.contains('delete-task-btn')) {
        const taskId = parseInt(event.target.getAttribute('data-id'));
        tasksData = tasksData.filter(task => task.id !== taskId);
        renderTasks();
      }
    });
  });
  