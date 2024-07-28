document.addEventListener('DOMContentLoaded', () => {
    fetchTasksData();

    function fetchTasksData() {
        fetch('/tasks') // Adjust the endpoint as per your server setup
            .then(response => response.json())
            .then(data => {
                updateStats(data);
                populateTaskSummary(data);
                displayRecentTask(data);
            })
            .catch(error => console.error('Error fetching tasks data:', error));
    }

    function updateStats(data) {
        const completedTasks = data.filter(task => task.status === 'Completed').length;
        const pendingTasks = data.filter(task => task.status === 'To-Do').length;
        const upcomingEvents = data.filter(task => new Date(task.dueDate) > new Date()).length;

        document.getElementById('tasks-completed').textContent = completedTasks;
        document.getElementById('pending-tasks').textContent = pendingTasks;
        document.getElementById('upcoming-events').textContent = upcomingEvents;
    }

    function populateTaskSummary(data) {
        const taskSummaryList = document.getElementById('task-summary-list');
        taskSummaryList.innerHTML = '';

        data.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.status}</td>
                <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            `;
            taskSummaryList.appendChild(row);
        });
    }

    function displayRecentTask(data) {
        const recentTaskContent = document.getElementById('recent-task-content');
        const recentTask = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

        if (recentTask) {
            recentTaskContent.innerHTML = `
                <h3>${recentTask.name}</h3>
                <p>Status: ${recentTask.status}</p>
                <p>Due Date: ${new Date(recentTask.dueDate).toLocaleDateString()}</p>
                <p>Description: ${recentTask.description}</p>
            `;
        } else {
            recentTaskContent.innerHTML = '<p>No recent tasks found.</p>';
        }
    }
});
