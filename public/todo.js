document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggleIcon = document.getElementById('sidebar-toggle-icon');
    const todoSidebar = document.getElementById('todo-sidebar');
    const addTodoButton = document.getElementById('add-todo-button');
    const todoList = document.getElementById('todo-list');
    const newTodoTitle = document.getElementById('new-todo-title');
    const updateModal = document.getElementById('update-modal');
    const updateTitleInput = document.getElementById('update-title-input');
    const updateTodoButton = document.getElementById('update-todo-button');
    const closeButton = document.querySelector('.close-button');
    const modalOverlay = document.querySelector('.modal-overlay');

    let currentTodoId = null;

    // Fetch todos from the server
    fetch('/todos')
        .then(response => response.json())
        .then(todos => {
            todos.forEach(todo => addTodoToDOM(todo._id, todo.title));
        })
        .catch(error => console.error('Error loading todos:', error));

    // Toggle sidebar
    sidebarToggleIcon.addEventListener('click', () => {
        todoSidebar.classList.toggle('open');
    });

    // Render todos in the DOM
    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            addTodoToDOM(todo._id, todo.title);
        });
    }

    // Add a new todo
    function addTodoToServer(title) {
        const newTodo = { title: title };

        fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        })
        .then(response => response.json())
        .then(data => {
            addTodoToDOM(data._id, data.title);
        })
        .catch(error => console.error('Error adding todo:', error));
    }

    // Update a todo
    function updateTodoInServer(id, title) {
        fetch(`/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title })
        })
        .then(response => response.json())
        .then(data => {
            updateTodoInDOM(data);
        })
        .catch(error => console.error('Error updating todo:', error));
    }

    // Delete a todo
    function deleteTodoFromServer(id) {
        fetch(`/todos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
        })
        .catch(error => console.error('Error deleting todo:', error));
    }

    // Function to add todo to the DOM
    function addTodoToDOM(id, title) {
        const li = document.createElement('li');
        li.dataset.id = id;
        li.innerHTML = `
            <span>${title}</span>
            <button class="edit-todo">Edit</button>
            <button class="delete-todo">Delete</button>
        `;
        todoList.appendChild(li);
    }

    // Function to update todo in the DOM
    function updateTodoInDOM(todo) {
        const todoElement = document.querySelector(`li[data-id="${todo._id}"]`);
        todoElement.querySelector('span').textContent = todo.title;
    }

    // Add todo event
    addTodoButton.addEventListener('click', () => {
        const title = newTodoTitle.value.trim();
        if (title) {
            addTodoToServer(title);
            newTodoTitle.value = '';
        }
    });

    // Edit and delete todo events
    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-todo')) {
            currentTodoId = e.target.closest('li').dataset.id;
            const todoTitle = e.target.previousElementSibling.textContent;
            updateTitleInput.value = todoTitle;
            updateModal.style.display = 'block';
            modalOverlay.style.display = 'block';
        } else if (e.target.classList.contains('delete-todo')) {
            const id = e.target.closest('li').dataset.id;
            if (confirm('Are you sure you want to delete this todo?')) {
                deleteTodoFromServer(id);
                e.target.closest('li').remove();
            }
        }
    });

    // Save updated todo
    updateTodoButton.addEventListener('click', () => {
        const newTitle = updateTitleInput.value.trim();
        if (newTitle) {
            updateTodoInServer(currentTodoId, newTitle);
            updateModal.style.display = 'none';
            modalOverlay.style.display = 'none';
        }
    });

    // Close update modal
    closeButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            updateModal.style.display = 'none';
            modalOverlay.style.display = 'none';
        }
    });
});
