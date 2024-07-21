document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTask);
    } else {
        console.error('Add Task button not found');
    }
    fetchTasks();
});

const API_URL = 'http://localhost:5000/api/tasks';

// Fetch tasks from the server
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error("Could not fetch tasks:", error);
        alert("Failed to load tasks. Please try again later.");
    }
}

// Display tasks in the table
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const row = createTaskRow(task);
        taskList.innerHTML += row;
    });
}

// Create a task row
function createTaskRow(task) {
    return `
        <tr>
            <td>${task.name}</td>
            <td>${task.assignee}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
            <td><button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button></td>
        </tr>
    `;
}

// Add a new task
async function addTask() {
    const name = document.getElementById('taskName').value.trim();
    const assignee = document.getElementById('assignee').value.trim();
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;

    if (!name || !assignee || !dueDate) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, assignee, dueDate, priority, status }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newTask = await response.json();
        console.log('Task added successfully:', newTask);

        // Append the new task to the table
        const taskList = document.getElementById('taskList');
        const row = createTaskRow(newTask);
        taskList.innerHTML += row;

        clearForm();
    } catch (error) {
        console.error('Error adding task:', error);
        alert('An error occurred while adding the task. Please try again.');
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('An error occurred while deleting the task. Please try again.');
    }
}

// Clear the form after adding a task
function clearForm() {
    document.getElementById('taskName').value = '';
    document.getElementById('assignee').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('priority').value = 'High';
    document.getElementById('status').value = 'Incomplete';
}
