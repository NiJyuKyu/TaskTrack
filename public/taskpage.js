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

    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTaskToDOM(task._id, task.name, task.assignee, task.dueDate, task.priority, task.status));
        })
        .catch(error => console.error('Error loading tasks:', error));

    addTaskButton.addEventListener('click', () => {
        openUpdateModal();
    });

    function openUpdateModal() {
        updateModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    function closeUpdateModal() {
        updateModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    saveUpdateButton.addEventListener('click', () => {
        if (currentTask) {
            fetch(`/tasks/${currentTask.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updateTaskName.value,
                    assignee: updateTaskAssignee.value,
                    dueDate: updateTaskDueDate.value,
                    priority: updateTaskPriority.value,
                    status: updateTaskStatus.value
                })
            })
            .then(response => response.json())
            .then(data => {
                currentTask.querySelector('td:nth-child(1)').textContent = data.name;
                currentTask.querySelector('td:nth-child(2)').textContent = data.assignee;
                currentTask.querySelector('td:nth-child(3)').textContent = new Date(data.dueDate).toLocaleDateString();
                currentTask.querySelector('td:nth-child(4)').textContent = data.priority;
                currentTask.querySelector('td:nth-child(5)').textContent = data.status;
                closeUpdateModal();
            })
            .catch(error => console.error('Error updating task:', error));
        } else {
            const newTask = {
                name: updateTaskName.value,
                assignee: updateTaskAssignee.value,
                dueDate: updateTaskDueDate.value,
                priority: updateTaskPriority.value,
                status: updateTaskStatus.value
            };
            addTaskToServer(newTask);
            closeUpdateModal();
        }
    });

    cancelUpdateButton.addEventListener('click', closeUpdateModal);

    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeUpdateModal();
        }
    });

    function addTaskToServer(task) {
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(data => addTaskToDOM(data._id, data.name, data.assignee, data.dueDate, data.priority, data.status))
        .catch(error => console.error('Error adding task:', error));
    }

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
            deleteTaskFromServer(id);
            taskElement.remove();
        });

        taskList.appendChild(taskElement);
    }

    function deleteTaskFromServer(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
        })
        .catch(error => console.error('Error deleting task:', error));
    }
});
