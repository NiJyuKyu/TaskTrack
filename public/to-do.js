document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTodoButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    const updateModal = document.getElementById('update-modal');
    const updateTaskInput = document.getElementById('update-task-input');
    const updateTaskButton = document.getElementById('update-task-button');
    const closeButton = document.querySelector('.close-button');
    
    let currentTask = null;

    // Load to-dos from the server
    fetch('/todolists')
        .then(response => response.json())
        .then(todos => {
            todos.forEach(todo => addTodoToDOM(todo._id, todo.title));
        })
        .catch(error => console.error('Error loading to-dos:', error));

    addTodoButton.addEventListener('click', () => {
        const title = titleInput.value;
        addTodoToServer(title);
        titleInput.value = ''; // Clear input field after adding the to-do
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
            taskInput.value = '';
        }
    });

    function addTask(task) {
        if (task.trim() === '') return;

        const listItem = document.createElement('li');

        const taskText = document.createElement('span');
        taskText.textContent = task;
        taskText.classList.add('task-text');
        taskText.addEventListener('click', () => {
            taskText.classList.toggle('completed');
        });

        const menu = document.createElement('span');
        menu.textContent = '⋮';
        menu.classList.add('menu');
        menu.addEventListener('click', () => {
            const menuContent = listItem.querySelector('.menu-content');
            menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
        });

        const menuContent = document.createElement('div');
        menuContent.classList.add('menu-content');

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
            currentTask = listItem;
            updateTaskInput.value = taskText.textContent;
            updateModal.style.display = 'flex';
            menuContent.style.display = 'none';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            listItem.remove();
        });

        menuContent.appendChild(updateButton);
        menuContent.appendChild(deleteButton);
        listItem.appendChild(taskText);
        listItem.appendChild(menu);
        listItem.appendChild(menuContent);
        taskList.appendChild(listItem);
    }

    updateTaskButton.addEventListener('click', () => {
        if (currentTask) {
            currentTask.querySelector('.task-text').textContent = updateTaskInput.value;
            updateModal.style.display = 'none';
        }
    });

    closeButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });
});