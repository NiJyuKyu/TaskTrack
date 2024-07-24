document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    const updateModal = document.getElementById('update-modal');
    const updateTaskInput = document.getElementById('update-task-input');
    const updateTaskButton = document.getElementById('update-task-button');
    const closeButton = document.querySelector('.close-button');

    const notesModal = document.getElementById('notes-modal');
    const notesInput = document.getElementById('notes-input');
    const addNotesButton = document.getElementById('add-notes-button');
    const closeNotesButton = document.querySelector('.close-notes-button');

    let currentTask = null;

    // Load tasks from the server
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTask(task.text, task._id, task.completed, task.notes));
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

    function addTask(task, id = null, completed = false, notes = '') {
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

        const notesButton = document.createElement('button');
        notesButton.textContent = 'Add Notes';
        notesButton.addEventListener('click', () => {
            currentTask = listItem;
            notesInput.value = listItem.querySelector('.notes').textContent;
            notesModal.style.display = 'flex';
            menuContent.style.display = 'none';
        });

        const notesDiv = document.createElement('div');
        notesDiv.classList.add('notes');
        notesDiv.textContent = notes;
        if (notes.trim() !== '') {
            notesDiv.style.display = 'block';
        } else {
            notesDiv.style.display = 'none';
        }

        menuContent.appendChild(updateButton);
        menuContent.appendChild(notesButton);
        menuContent.appendChild(deleteButton);
        listItem.appendChild(taskText);
        listItem.appendChild(menu);
        listItem.appendChild(menuContent);
        listItem.appendChild(notesDiv);
        taskList.appendChild(listItem);
    }

    function addTaskToServer(task) {
        if (task.trim() === '') return;

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: task })
        })
        .then(response => response.json())
        .then(data => addTask(data.text, data._id, data.completed, data.notes));
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

    function deleteTaskFromServer(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    updateTaskButton.addEventListener('click', () => {
        if (currentTask) {
            fetch(`/tasks/${currentTask.dataset.id}`, {
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

    addNotesButton.addEventListener('click', () => {
        if (currentTask) {
            const notesDiv = currentTask.querySelector('.notes');
            const notesText = notesInput.value;
            notesDiv.textContent = notesText;
            notesDiv.style.display = notesText.trim() !== '' ? 'block' : 'none';
            
            fetch(`/tasks/${currentTask.dataset.id}/notes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notes: notesText })
            })
            .then(response => response.json())
            .then(() => {
                notesModal.style.display = 'none';
            });
        }
    });

    closeButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    closeNotesButton.addEventListener('click', () => {
        notesModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            updateModal.style.display = 'none';
        }
        if (event.target === notesModal) {
            notesModal.style.display = 'none';
        }
    });
});
