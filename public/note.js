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

    addTaskButton.addEventListener('click', () => {
        addTask(taskInput.value);
        taskInput.value = '';
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
        
        // Populate notes if they exist
        const existingNotes = localStorage.getItem(`notes-${task}`);
        if (existingNotes) {
            notesDiv.textContent = existingNotes;
            notesDiv.style.display = 'block';
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

    updateTaskButton.addEventListener('click', () => {
        if (currentTask) {
            currentTask.querySelector('.task-text').textContent = updateTaskInput.value;
            updateModal.style.display = 'none';
        }
    });

    addNotesButton.addEventListener('click', () => {
        if (currentTask) {
            const notesDiv = currentTask.querySelector('.notes');
            const notesText = notesInput.value;
            notesDiv.textContent = notesText;
            notesDiv.style.display = notesText.trim() !== '' ? 'block' : 'none';
            // Save notes to localStorage
            localStorage.setItem(`notes-${currentTask.querySelector('.task-text').textContent}`, notesText);
            notesModal.style.display = 'none';
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
