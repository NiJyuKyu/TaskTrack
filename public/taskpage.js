document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const addTaskButton = document.getElementById('addTaskButton');

    const tasks = [
        { name: 'Welcome Page', assignee: 'KG', dueDate: 'Mar 8', priority: 'High', status: 'Complete' },
        { name: 'Sign In', assignee: 'CP', dueDate: 'Mar 8', priority: 'High', status: 'Complete' },
        { name: 'Sign Up', assignee: 'ER', dueDate: 'Mar 8', priority: 'High', status: 'Complete' },
        { name: 'User Authentication', assignee: 'AG', dueDate: 'Mar 8', priority: 'High', status: 'Complete' },
        { name: 'Verification', assignee: 'JP', dueDate: 'Mar 8', priority: 'High', status: 'Complete' },
        { name: 'Forgot Password', assignee: 'JI', dueDate: 'Mar 8', priority: 'High', status: 'Complete' },
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
                <td><button class="delete" data-index="${index}">Delete</button></td>
            `;
            taskList.appendChild(row);
        });
    };

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const index = e.target.getAttribute('data-index');
            tasks.splice(index, 1);
            renderTasks();
        }
    });

    addTaskButton.addEventListener('click', () => {
        const name = prompt('Task Name:');
        const assignee = prompt('Assignee:');
        const dueDate = prompt('Due Date:');
        const priority = prompt('Priority:');
        const status = prompt('Status:');

        if (name && assignee && dueDate && priority && status) {
            tasks.push({ name, assignee, dueDate, priority, status });
            renderTasks();
        } else {
            alert('All fields are required!');
        }
    });

    renderTasks();
});
