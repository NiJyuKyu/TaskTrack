document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todoList');
    const addToDoButton = document.getElementById('addToDoButton');

    const loadToDos = async () => {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.className = 'sidebar-item';
            listItem.innerHTML = `
                <input type="checkbox" id="${todo._id}" ${todo.completed ? 'checked' : ''} onchange="toggleToDo('${todo._id}', this)">
                <label for="${todo._id}" class="${todo.completed ? 'completed' : ''}">${todo.title}</label>
                <span class="sidebar-date">${new Date(todo.date).toLocaleDateString()}</span>
                <span class="sidebar-tag">${todo.tag}</span>
                <button class="edit-btn" onclick="editToDo('${todo._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteToDo('${todo._id}')">Delete</button>
            `;
            todoList.appendChild(listItem);
        });
    };

    addToDoButton.addEventListener('click', () => {
        const newToDoTitle = prompt('Enter To-Do title:');
        if (newToDoTitle) {
            addToDo({
                title: newToDoTitle,
                completed: false,
                date: new Date(),
                tag: 'General'
            });
        }
    });

    const addToDo = async (todo) => {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
        await response.json();
        loadToDos();
    };

    window.toggleToDo = async (id, checkbox) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: checkbox.checked })
        });
        const updatedToDo = await response.json();
        checkbox.nextSibling.classList.toggle('completed', updatedToDo.completed);
    };

    window.editToDo = async (id) => {
        const newToDoTitle = prompt('Edit To-Do title:');
        if (newToDoTitle) {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newToDoTitle })
            });
            await response.json();
            loadToDos();
        }
    };

    window.deleteToDo = async (id) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });
        await response.json();
        loadToDos();
    };

    loadToDos();
});
