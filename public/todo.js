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
    const modalOverlay = document.getElementById('modal-overlay');

    let todos = [];
    let currentTodoId = null;

    // Toggle the sidebar visibility
    sidebarToggleIcon.addEventListener('click', () => {
        todoSidebar.classList.toggle('open');
        modalOverlay.classList.toggle('active');
    });

    // Render To-Do items
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

    // Add a new To-Do
    function addTodo(title) {
        const newTodo = {
            id: Date.now(),
            title: title
        };
        todos.push(newTodo);
        renderTodos();
    }

    // Update an existing To-Do
    function updateTodo(id, title) {
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos[index].title = title;
            renderTodos();
        }
    }

    // Delete a To-Do
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    }

    // Add To-Do button click handler
    addTodoButton.addEventListener('click', () => {
        const title = newTodoTitle.value.trim();
        if (title) {
            addTodo(title);
            newTodoTitle.value = '';
        }
    });

    // To-Do list click handler
    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-todo')) {
            currentTodoId = parseInt(e.target.getAttribute('data-id'));
            const todo = todos.find(todo => todo.id === currentTodoId);
            updateTitleInput.value = todo.title;
            updateModal.style.display = 'block';
            modalOverlay.classList.add('active');
        } else if (e.target.classList.contains('delete-todo')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteTodo(id);
        }
    });

    // Update To-Do button click handler
    updateTodoButton.addEventListener('click', () => {
        const newTitle = updateTitleInput.value.trim();
        if (newTitle) {
            updateTodo(currentTodoId, newTitle);
            updateModal.style.display = 'none';
            modalOverlay.classList.remove('active');
        }
    });

    // Close modal button click handler
    closeButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    });

    // Close sidebar and modal when clicking outside of the sidebar or modal
    modalOverlay.addEventListener('click', () => {
        todoSidebar.classList.remove('open');
        modalOverlay.classList.remove('active');
        updateModal.style.display = 'none';
    });

    // Initial render
    renderTodos();
});
