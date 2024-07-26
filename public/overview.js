document.addEventListener('DOMContentLoaded', function() {
    fetchTasksData();
});

function fetchTasksData() {
    // In a real application, you would fetch this data from your server
    // For this example, we'll use mock data
    const tasksData = {
        completed: 10,
        pending: 5,
        upcoming: 3
    };

    updateTasksOverview(tasksData);
    fetchTasksSummary();
}

function updateTasksOverview(data) {
    document.getElementById('tasks-completed').textContent = data.completed;
    document.getElementById('pending-tasks').textContent = data.pending;
    document.getElementById('upcoming-events').textContent = data.upcoming;
}

function fetchTasksSummary() {
    // Again, in a real application, you would fetch this from your server
    const tasksSummary = [
        { task: "Complete project proposal", status: "In Progress", dueDate: "2024-08-01" },
        { task: "Client meeting", status: "Scheduled", dueDate: "2024-07-30" },
        { task: "Review code changes", status: "Pending", dueDate: "2024-07-28" }
    ];

    updateTasksSummary(tasksSummary);
}

function updateTasksSummary(summary) {
    const taskSummaryList = document.getElementById('task-summary-list');
    taskSummaryList.innerHTML = '';

    summary.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.task}</td>
            <td>${task.status}</td>
            <td>${task.dueDate}</td>
        `;
        taskSummaryList.appendChild(row);
    });
}