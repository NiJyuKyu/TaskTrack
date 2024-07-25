document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('new-todo-title');
    const addTodoButton = document.getElementById('add-todo-button');
    const todoList = document.getElementById('todo-list');
    const updateTitleInput = document.getElementById('update-title-input');
    const updateTodoButton = document.getElementById('update-todo-button');
    const cancelUpdateButton = document.querySelector('#update-modal .close-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const toggleSidebarIcon = document.getElementById('sidebar-toggle-icon');
    const sidebar = document.getElementById('todo-sidebar');

    let currentTodo = null;

    // Toggle sidebar visibility
    toggleSidebarIcon.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar if clicked outside of it
    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && !toggleSidebarIcon.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Add to-do button click event
    addTodoButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (title) {
            addTodoToServer(title);
            titleInput.value = '';
        } else {
            alert('Please enter a to-do.');
        }
    });

    // Add to-do on Enter key press
    titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const title = titleInput.value.trim();
            if (title) {
                addTodoToServer(title);
                titleInput.value = '';
            } else {
                alert('Please enter a to-do.');
            }
        }
    });

    // Add to-do to server
    function addTodoToServer(title) {
        fetch('/api/todolists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: title })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            addTodoToDOM(data._id, data.text);
        })
        .catch(error => {
            console.error('Error adding todo:', error);
            alert(`Failed to add todo: ${error.message}`);
        });
    }

    // Add to-do to DOM
    function addTodoToDOM(id, text) {
        const todoElement = document.createElement('li');
        todoElement.textContent = text;
        todoElement.dataset.id = id;

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('update-task-button');
        updateButton.addEventListener('click', () => {
            currentTodo = todoElement;
            updateTitleInput.value = text;
            openUpdateModal();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-task-button');
        deleteButton.addEventListener('click', () => {
            deleteTodoFromServer(id, todoElement);
        });

        todoElement.appendChild(updateButton);
        todoElement.appendChild(deleteButton);
        todoList.appendChild(todoElement);
    }

    // Update to-do on server
    function updateTodoOnServer(id, newText) {
        fetch(`/api/todolists/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            currentTodo.childNodes[0].textContent = newText;
            closeUpdateModal();
        })
        .catch(error => {
            console.error('Error updating todo:', error);
            alert('Failed to update todo. Please try again.');
        });
    }

    // Delete to-do from server
    function deleteTodoFromServer(id, todoElement) {
        fetch(`/api/todolists/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            todoElement.remove();
            if (todoList.children.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'No to-dos yet.';
                todoList.appendChild(emptyMessage);
            }
        })
        .catch(error => {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo. Please try again.');
        });
    }

    // Update to-do button click event
    updateTodoButton.addEventListener('click', () => {
        if (currentTodo) {
            const newText = updateTitleInput.value.trim();
            if (newText) {
                const id = currentTodo.dataset.id;
                updateTodoOnServer(id, newText);
            } else {
                alert('Please enter a new text.');
            }
        }
    });

    // Open update modal
    function openUpdateModal() {
        document.getElementById('update-modal').style.display = 'flex';
        modalOverlay.style.display = 'block';
    }

    // Close update modal
    function closeUpdateModal() {
        document.getElementById('update-modal').style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    // Close modal when clicking on overlay
    modalOverlay.addEventListener('click', closeUpdateModal);
});
