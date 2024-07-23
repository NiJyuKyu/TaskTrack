document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const addTaskButton = document.getElementById('addTaskButton');
    const updateTaskModal = document.getElementById('updateTaskModal');
    const updateTaskName = document.getElementById('updateTaskName');
    const updateTaskAssignee = document.getElementById('updateTaskAssignee');
    const updateTaskDueDate = document.getElementById('updateTaskDueDate');
    const updateTaskPriority = document.getElementById('updateTaskPriority');
    const updateTaskStatus = document.getElementById('updateTaskStatus');
    const saveUpdateButton = document.getElementById('saveUpdateButton');
    const cancelUpdateButton = document.getElementById('cancelUpdateButton');
    let currentTaskIndex = null;

    const tasks = [
        { name: 'Welcome Page', assignee: 'Celestra', dueDate: 'June 26', priority: 'High', status: 'complete' },
        { name: 'Sign In', assignee: 'Celestra', dueDate: 'June 30', priority: 'High', status: 'complete' },
        { name: 'Sign Up', assignee: 'Penional', dueDate: 'June 31', priority: 'High', status: 'complete' },
        { name: 'User Authentication', assignee: 'Quinones', dueDate: 'July 1', priority: 'High', status: 'complete' }
    ];

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.assignee}</td>
                <td>${task.dueDate}</td>
                <td>${task.priority}</td>
                <td>${task.status}</td>
                <td>
                    <button class="update" data-index="${index}">Update</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </td>
            `;
            taskList.appendChild(row);
        });
    };

    taskList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('delete')) {
            tasks.splice(index, 1);
            renderTasks();
        } else if (e.target.classList.contains('update')) {
            openUpdateModal(index);
        }
    });

    addTaskButton.addEventListener('click', () => {
        const name = prompt('Task Name:');
        const assignee = prompt('Assignee:');
        const dueDate = prompt('Due Date:');
        const priority = prompt('Priority:');
        const status = prompt('Status (to-do, incomplete, complete):');

        if (name && assignee && dueDate && priority && status) {
            tasks.push({ name, assignee, dueDate, priority, status });
            renderTasks();
        } else {
            alert('All fields are required!');
        }
    });

    const openUpdateModal = (index) => {
        currentTaskIndex = index;
        const task = tasks[index];
        updateTaskName.value = task.name;
        updateTaskAssignee.value = task.assignee;
        updateTaskDueDate.value = task.dueDate;
        updateTaskPriority.value = task.priority;
        updateTaskStatus.value = task.status;
        updateTaskModal.style.display = 'block';
    };

    saveUpdateButton.addEventListener('click', () => {
        if (currentTaskIndex !== null) {
            const task = tasks[currentTaskIndex];
            task.name = updateTaskName.value;
            task.assignee = updateTaskAssignee.value;
            task.dueDate = updateTaskDueDate.value;
            task.priority = updateTaskPriority.value;
            task.status = updateTaskStatus.value;
            renderTasks();
            updateTaskModal.style.display = 'none';
        }
    });

    cancelUpdateButton.addEventListener('click', () => {
        updateTaskModal.style.display = 'none';
    });

    renderTasks();
});