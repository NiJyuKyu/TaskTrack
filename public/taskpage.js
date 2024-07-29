document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const updateModal = document.getElementById('updateTaskModal');
    const updateTaskName = document.getElementById('updateTaskName');
    const updateTaskAssignee = document.getElementById('updateTaskAssignee');
    const updateTaskDueDate = document.getElementById('updateTaskDueDate');
    const updateTaskPriority = document.getElementById('updateTaskPriority');
    const updateTaskStatus = document.getElementById('updateTaskStatus');
    const saveUpdateButton = document.getElementById('saveUpdateButton');
    const cancelUpdateButton = document.getElementById('cancelUpdateButton');
    const modalOverlay = document.querySelector('.modal-overlay');

    let currentTask = null;

    // Load tasks from the server
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTaskToDOM(task._id, task.name, task.assignee, task.dueDate, task.priority, task.status));
        })
        .catch(error => console.error('Error loading tasks:', error));

    // Event listener to open the add task modal
    addTaskButton.addEventListener('click', () => {
        currentTask = null; // Ensure we're adding a new task, not updating
        clearForm();
        openUpdateModal();
    });

    // Function to open the modal
    function openUpdateModal() {
        updateModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    // Function to close the modal
    function closeUpdateModal() {
        updateModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    // Function to clear the form
    function clearForm() {
        updateTaskName.value = '';
        updateTaskAssignee.value = '';
        updateTaskDueDate.value = '';
        updateTaskPriority.value = '';
        updateTaskStatus.value = '';
    }

    // Event listener to save or update a task
    saveUpdateButton.addEventListener('click', () => {
        const newTask = {
            name: updateTaskName.value,
            assignee: updateTaskAssignee.value,
            dueDate: updateTaskDueDate.value,
            priority: updateTaskPriority.value,
            status: updateTaskStatus.value
        };

        if (currentTask) {
            // Update existing task
            fetch(`/tasks/${currentTask.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            })
            .then(response => response.json())
            .then(data => {
                updateTaskInDOM(data);
                closeUpdateModal();
            })
            .catch(error => console.error('Error updating task:', error));
        } else {
            // Add new task
            addTaskToServer(newTask);
            closeUpdateModal();
        }
    });

    // Event listener to cancel the update
    cancelUpdateButton.addEventListener('click', closeUpdateModal);

    // Event listener to close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeUpdateModal();
        }
    });

    // Function to add a task to the server
    function addTaskToServer(task) {
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(data => {
            addTaskToDOM(data._id, data.name, data.assignee, data.dueDate, data.priority, data.status);
            saveTaskToLocal(data); // Save task to Local Storage
            saveTaskToSession(data); // Save task to Session Storage
        })
        .catch(error => console.error('Error adding task:', error));
    }

    // Function to update a task in the DOM
    function updateTaskInDOM(task) {
        const taskElement = document.querySelector(`tr[data-id="${task._id}"]`);
        taskElement.querySelector('td:nth-child(1)').textContent = task.name;
        taskElement.querySelector('td:nth-child(2)').textContent = task.assignee;
        taskElement.querySelector('td:nth-child(3)').textContent = new Date(task.dueDate).toLocaleDateString();
        taskElement.querySelector('td:nth-child(4)').textContent = task.priority;
        taskElement.querySelector('td:nth-child(5)').textContent = task.status;
    }

    // Function to add a task to the DOM
    function addTaskToDOM(id, name, assignee, dueDate, priority, status) {
        const taskElement = document.createElement('tr');
        taskElement.dataset.id = id;

        taskElement.innerHTML = `
            <td>${name}</td>
            <td>${assignee}</td>
            <td>${new Date(dueDate).toLocaleDateString()}</td>
            <td>${priority}</td>
            <td>${status}</td>
            <td>
                <button class="update-task-button">Update</button>
                <button class="delete-task-button">Delete</button>
            </td>
        `;

        taskElement.querySelector('.update-task-button').addEventListener('click', () => {
            currentTask = taskElement;
            updateTaskName.value = name;
            updateTaskAssignee.value = assignee;
            updateTaskDueDate.value = new Date(dueDate).toISOString().split('T')[0];
            updateTaskPriority.value = priority;
            updateTaskStatus.value = status;
            openUpdateModal();
        });

        taskElement.querySelector('.delete-task-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTaskFromServer(id);
                taskElement.remove();
            }
        });

        taskList.appendChild(taskElement);
    }

    // Function to delete a task from the server
    function deleteTaskFromServer(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
        })
        .catch(error => console.error('Error deleting task:', error));
    }

    // Save a task to Local Storage
    function saveTaskToLocal(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from Local Storage
    function loadTasksFromLocal() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Remove a task from Local Storage
    function removeTaskFromLocal(id) {
        let tasks = loadTasksFromLocal();
        tasks = tasks.filter(task => task._id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Save a task to Session Storage
    function saveTaskToSession(task) {
        let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
        tasks.push(task);
        sessionStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from Session Storage
    function loadTasksFromSession() {
        return JSON.parse(sessionStorage.getItem('tasks')) || [];
    }

    // Remove a task from Session Storage
    function removeTaskFromSession(id) {
        let tasks = loadTasksFromSession();
        tasks = tasks.filter(task => task._id !== id);
        sessionStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
