document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    const updateModal = document.getElementById('update-modal');
    const updateTaskInput = document.getElementById('update-task-input');
    const updateTaskButton = document.getElementById('update-task-button');
    const closeButton = document.querySelector('.close-button');

    let currentTask = null;

    // Load tasks from the server
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTask(task._id, task.name, task.assignee, task.dueDate, task.priority, task.status));
        });

    addTaskButton.addEventListener('click', () => {
        addTaskToServer(taskInput.value);
        taskInput.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskToServer(taskInput.value);
            taskInput.value = '';
        }
    });

    function addTaskToServer(task) {
        if (task.trim() === '') return;

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: task, assignee: '', dueDate: new Date(), priority: 'Low', status: 'To-do' })
        })
        .then(response => response.json())
        .then(data => addTask(data._id, data.name, data.assignee, data.dueDate, data.priority, data.status));
    }

    function addTask(id, name, assignee, dueDate, priority, status) {
        const listItem = document.createElement('li');
        listItem.dataset.id = id;

        const taskText = document.createElement('span');
        taskText.textContent = name;
        taskText.classList.add('task-text');
        taskText.addEventListener('click', () => {
            taskText.classList.toggle('completed');
            updateTaskCompletion(id, taskText.classList.contains('completed'));
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
            deleteTaskFromServer(id);
            listItem.remove();
        });

        menuContent.appendChild(updateButton);
        menuContent.appendChild(deleteButton);
        listItem.appendChild(taskText);
        listItem.appendChild(menu);
        listItem.appendChild(menuContent);
        taskList.appendChild(listItem);
    }

    function updateTaskCompletion(id, completed) {
        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
    }

    updateTaskButton.addEventListener('click', () => {
        if (currentTask) {
            fetch(`/tasks/${currentTask.dataset.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: updateTaskInput.value })
            })
            .then(response => response.json())
            .then(data => {
                currentTask.querySelector('.task-text').textContent = data.name;
                updateModal.style.display = 'none';
            });
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
