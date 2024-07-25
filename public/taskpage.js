document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
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

    let currentTask = null;

    // Load tasks from the server
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => addTask(task._id, task.name, task.assignee, task.dueDate, task.priority, task.status));
        })
        .catch(error => console.error('Error loading tasks:', error));

    addTaskButton.addEventListener('click', () => {
        const taskName = taskInput.value;
        addTaskToServer(taskName);
        taskInput.value = ''; // Clear the input field after adding the task
    });

    function addTaskToServer(name) {
        if (name.trim() === '') return; // Do not add empty tasks

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                assignee: '',
                dueDate: new Date().toISOString(),
                priority: 'Low',
                status: 'To-Do'
            })
        })
        .then(response => response.json())
        .then(data => addTask(data._id, data.name, data.assignee, data.dueDate, data.priority, data.status))
        .catch(error => console.error('Error adding task:', error)); // Add error handling
    }

    function addTask(id, name, assignee, dueDate, priority, status) {
        const listItem = document.createElement('tr');
        listItem.dataset.id = id;

        listItem.innerHTML = `
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

        listItem.querySelector('.update-task-button').addEventListener('click', () => {
            currentTask = listItem;
            updateTaskName.value = name;
            updateTaskAssignee.value = assignee;
            updateTaskDueDate.value = new Date(dueDate).toISOString().split('T')[0];
            updateTaskPriority.value = priority;
            updateTaskStatus.value = status;
            updateModal.style.display = 'block';
        });

        listItem.querySelector('.delete-task-button').addEventListener('click', () => {
            deleteTaskFromServer(id);
            listItem.remove();
        });

        taskList.appendChild(listItem);
    }

    function deleteTaskFromServer(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            console.log('Task deleted successfully');
        })
        .catch(error => console.error('Error deleting task:', error));
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
                currentTask.children[0].textContent = data.name;
                currentTask.children[1].textContent = data.assignee;
                currentTask.children[2].textContent = new Date(data.dueDate).toLocaleDateString();
                currentTask.children[3].textContent = data.priority;
                currentTask.children[4].textContent = data.status;
                updateModal.style.display = 'none';
            })
            .catch(error => console.error('Error updating task:', error));
        }
    });

    cancelUpdateButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });
});
