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
    fetch('/todolists')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTask(task.text, task._id, task.completed));
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

    function addTask(task, id = null, completed = false) {
        if (task.trim() === '') return;

        const listItem = document.createElement('li');
        if (id) listItem.dataset.id = id;

        const taskText = document.createElement('span');
        taskText.textContent = task;
        taskText.classList.add('task-text');
        if (completed) taskText.classList.add('completed');
        taskText.addEventListener('click', () => {
            taskText.classList.toggle('completed');
            updateTaskCompletion(listItem.dataset.id, taskText.classList.contains('completed'));
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
            deleteTaskFromServer(listItem.dataset.id);
            listItem.remove();
        });

        menuContent.appendChild(updateButton);
        menuContent.appendChild(deleteButton);
        listItem.appendChild(taskText);
        listItem.appendChild(menu);
        listItem.appendChild(menuContent);
        taskList.appendChild(listItem);
    }

    function addTaskToServer(task) {
        if (task.trim() === '') return;

        fetch('/todolists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: task })
        })
        .then(response => response.json())
        .then(data => addTask(data.text, data._id, data.completed));
    }

    function updateTaskCompletion(id, completed) {
        fetch(`/todolists/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
    }

    function deleteTaskFromServer(id) {
        fetch(`/todolists/${id}`, {
            method: 'DELETE'
        });
    }

    updateTaskButton.addEventListener('click', () => {
        if (currentTask) {
            fetch(`/todolists/${currentTask.dataset.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: updateTaskInput.value })
            })
            .then(response => response.json())
            .then(data => {
                currentTask.querySelector('.task-text').textContent = data.text;
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
