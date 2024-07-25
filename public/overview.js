document.addEventListener('DOMContentLoaded', () => {
    const tasksCompletedElement = document.getElementById('tasks-completed');
    const pendingTasksElement = document.getElementById('pending-tasks');
    const upcomingEventsElement = document.getElementById('upcoming-tasks');
    const taskSummaryList = document.getElementById('task-summary-list');

    // Fetch task data from the server
    fetch('/api/tasks') // Adjust the endpoint based on your server configuration
        .then(response => response.json())
        .then(data => {
            const tasks = data.tasks;
            
            // Calculate tasks statistics
            const tasksCompleted = tasks.filter(task => task.status === 'Complete').length;
            const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
            const upcomingEvents = tasks.filter(task => new Date(task.dueDate) > new Date()).length;

            // Update statistics
            tasksCompletedElement.textContent = tasksCompleted;
            pendingTasksElement.textContent = pendingTasks;
            upcomingEventsElement.textContent = upcomingEvents;

            // Generate task summary table
            taskSummaryList.innerHTML = tasks.map(task => `
                <tr>
                    <td>${task.name}</td>
                    <td>${task.status}</td>
                    <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error fetching tasks:', error));
});
