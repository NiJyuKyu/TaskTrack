document.addEventListener('DOMContentLoaded', () => {
    const addTodoButton = document.getElementById('addTodoButton');
    const todosContainer = document.getElementById('todosContainer');
    const addTodoModal = document.getElementById('addTodoModal');
    const updateTodoModal = document.getElementById('updateTodoModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const todoTitle = document.getElementById('todoTitle');
    const updateTodoTitle = document.getElementById('updateTodoTitle');
    const saveUpdateButton = document.getElementById('saveUpdateButton');
    const cancelAddTodoButton = document.getElementById('cancelAddTodoButton');
    const closeAddTodoModalButton = document.getElementById('closeAddTodoModalButton');
    const closeUpdateTodoModalButton = document.getElementById('closeUpdateTodoModalButton');
    const cancelUpdateTodoButton = document.getElementById('cancelUpdateTodoButton');
    const openAddTodoModalButton = document.getElementById('openAddTodoModalButton');

    let currentTodo = null;

    // Load todos from the server
    fetch('/todolists')
        .then(response => response.json())
        .then(todos => {
            todos.forEach(todo => addTodoToDOM(todo._id, todo.title));
        })
        .catch(error => console.error('Error loading todos:', error));

    // Event listener to open the add todo modal
    openAddTodoModalButton.addEventListener('click', () => {
        currentTodo = null; // Ensure we're adding a new todo, not updating
        clearForm();
        openAddTodoModal();
    });

    // Function to open the add todo modal
    function openAddTodoModal() {
        addTodoModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    // Function to close the add todo modal
    function closeAddTodoModal() {
        addTodoModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    // Function to open the update todo modal
    function openUpdateTodoModal() {
        updateTodoModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    // Function to close the update todo modal
    function closeUpdateTodoModal() {
        updateTodoModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    // Function to clear the form
    function clearForm() {
        todoTitle.value = '';
        updateTodoTitle.value = '';
    }

    // Event listener to save or update a todo
    addTodoButton.addEventListener('click', () => {
        const newTodo = {
            title: todoTitle.value
        };

        if (currentTodo) {
            // Update existing todo
            fetch(`/todolists/${currentTodo.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            })
            .then(response => response.json())
            .then(data => {
                updateTodoInDOM(data);
                closeAddTodoModal();
            })
            .catch(error => console.error('Error updating todo:', error));
        } else {
            // Add new todo
            addTodoToServer(newTodo);
            closeAddTodoModal();
        }
    });

    // Save update button event listener
    saveUpdateButton.addEventListener('click', () => {
        const updatedTodo = {
            title: updateTodoTitle.value
        };

        if (currentTodo) {
            fetch(`/todolists/${currentTodo.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodo)
            })
            .then(response => response.json())
            .then(data => {
                updateTodoInDOM(data);
                closeUpdateTodoModal();
            })
            .catch(error => console.error('Error updating todo:', error));
        }
    });

    // Event listeners to close modals
    cancelAddTodoButton.addEventListener('click', closeAddTodoModal);
    closeAddTodoModalButton.addEventListener('click', closeAddTodoModal);
    closeUpdateTodoModalButton.addEventListener('click', closeUpdateTodoModal);
    cancelUpdateTodoButton.addEventListener('click', closeUpdateTodoModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeAddTodoModal();
            closeUpdateTodoModal();
        }
    });

    // Function to add a todo to the server
    function addTodoToServer(todo) {
        fetch('/todolists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        })
        .then(response => response.json())
        .then(data => {
            addTodoToDOM(data._id, data.title);
        })
        .catch(error => console.error('Error adding todo:', error));
    }

    // Function to update a todo in the DOM
    function updateTodoInDOM(todo) {
        const todoElement = document.querySelector(`li[data-id="${todo._id}"]`);
        todoElement.querySelector('.todo-title').textContent = todo.title;
    }

    // Function to add a todo to the DOM
    function addTodoToDOM(id, title) {
        const todoElement = document.createElement('li');
        todoElement.dataset.id = id;

        todoElement.innerHTML = `
            <div class="todo">
                <h3 class="todo-title">${title}</h3>
                <button class="update-todo-button">Update</button>
                <button class="delete-todo-button">Delete</button>
            </div>
        `;

        todoElement.querySelector('.update-todo-button').addEventListener('click', () => {
            currentTodo = todoElement;
            updateTodoTitle.value = title;
            openUpdateTodoModal();
        });

        todoElement.querySelector('.delete-todo-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this todo?')) {
                deleteTodoFromServer(id);
                todoElement.remove();
            }
        });

        todosContainer.appendChild(todoElement);
    }

    // Function to delete a todo from the server
    function deleteTodoFromServer(id) {
        fetch(`/todolists/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
        })
        .catch(error => console.error('Error deleting todo:', error));
    }
});
