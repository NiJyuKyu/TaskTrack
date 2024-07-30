document.addEventListener('DOMContentLoaded', () => {
    fetchTasksData();
    fetchCalendarEvents();

    function fetchTasksData() {
        fetch('/tasks') // Adjust the endpoint as per your server setup
            .then(response => response.json())
            .then(data => {
                console.log('Tasks Data:', data); // Debugging log
                updateStats(data);
                populateTaskSummary(data);
                displayRecentTask(data);
            })
            .catch(error => console.error('Error fetching tasks data:', error));
    }

    function fetchCalendarEvents() {
        fetch('/events') // Adjust the endpoint for calendar events
            .then(response => response.json())
            .then(data => {
                console.log('Events Data:', data); // Debugging log
                updateUpcomingEvents(data);
            })
            .catch(error => console.error('Error fetching calendar events:', error));
    }

    function updateStats(data) {
        const completedTasks = data.filter(task => task.status === 'Completed').length;
        const pendingTasks = data.filter(task => task.status === 'Incomplete' || task.status === 'Ongoing').length;

        console.log('Completed Tasks Count:', completedTasks); // Debugging log
        console.log('Pending Tasks Count:', pendingTasks); // Debugging log

        document.getElementById('tasks-completed').textContent = completedTasks;
        document.getElementById('pending-tasks').textContent = pendingTasks;
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

        console.log('Recent Task:', recentTask); // Debugging log

        if (recentTask) {
            recentTaskContent.innerHTML = `
                <h3>${recentTask.name}</h3>
                <p>Status: ${recentTask.status}</p>
                <p>Due Date: ${new Date(recentTask.dueDate).toLocaleDateString()}</p>
            `;
        } else {
            recentTaskContent.innerHTML = '<p>No recent tasks found.</p>';
        }
    }

    function updateUpcomingEvents(events) {
        const upcomingEventsElement = document.getElementById('upcoming-events');
        const upcomingEventsList = document.getElementById('upcoming-events-list');
        upcomingEventsList.innerHTML = '';

        const today = new Date();
        const upcomingEvents = events.filter(event => new Date(event.date) > today);

        console.log('Upcoming Events:', upcomingEvents); // Debugging log

        upcomingEvents.forEach(event => {
            const eventItem = document.createElement('li');
            eventItem.textContent = `${event.title} - ${new Date(event.date).toLocaleDateString()}`;
            upcomingEventsList.appendChild(eventItem);
        });

        upcomingEventsElement.textContent = `${upcomingEvents.length}`;
    }
});
