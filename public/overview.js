document.addEventListener('DOMContentLoaded', function() {
    const profileModal = document.getElementById('editProfileModal');
    const closeModal = document.querySelector('.modal .close');
    
    // Open and close profile modal
    document.getElementById('edit-profile').addEventListener('click', function() {
        profileModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        profileModal.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target == profileModal) {
            profileModal.style.display = 'none';
        }
    };

    // Sample data for overview page
    document.getElementById('tasks-completed').textContent = '10';
    document.getElementById('pending-tasks').textContent = '5';
    document.getElementById('upcoming-events').textContent = '3';

    const taskSummaryList = document.getElementById('task-summary-list');

    // Example tasks
    const tasks = [
        { name: 'Task 1', status: 'Complete', dueDate: '2024-07-25' },
        { name: 'Task 2', status: 'Incomplete', dueDate: '2024-07-30' },
        { name: 'Task 3', status: 'To-Do', dueDate: '2024-08-05' }
    ];

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.status}</td>
            <td>${task.dueDate}</td>
        `;
        taskSummaryList.appendChild(row);
    });
});
