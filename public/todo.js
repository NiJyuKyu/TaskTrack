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

    let todos = [];
    let currentTodoId = null;

    sidebarToggleIcon.addEventListener('click', () => {
        todoSidebar.classList.toggle('open');
    });

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${todo.title}</span>
                <button class="edit-todo" data-id="${todo.id}">Edit</button>
                <button class="delete-todo" data-id="${todo.id}">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    function addTodo(title) {
        const newTodo = {
            id: Date.now(),
            title: title
        };
        todos.push(newTodo);
        renderTodos();
    }

    function updateTodo(id, title) {
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos[index].title = title;
            renderTodos();
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    }

    addTodoButton.addEventListener('click', () => {
        const title = newTodoTitle.value.trim();
        if (title) {
            addTodo(title);
            newTodoTitle.value = '';
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-todo')) {
            currentTodoId = parseInt(e.target.getAttribute('data-id'));
            const todo = todos.find(todo => todo.id === currentTodoId);
            updateTitleInput.value = todo.title;
            updateModal.style.display = 'block';
        } else if (e.target.classList.contains('delete-todo')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteTodo(id);
        }
    });

    updateTodoButton.addEventListener('click', () => {
        const newTitle = updateTitleInput.value.trim();
        if (newTitle) {
            updateTodo(currentTodoId, newTitle);
            updateModal.style.display = 'none';
        }
    });

    closeButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    // Initial render
    renderTodos();
});