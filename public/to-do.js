document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('new-todo');
    const addTodoButton = document.getElementById('add-todo-button');
    const taskList = document.getElementById('task-list');

    const updateModal = document.getElementById('update-modal');
    const updateTodoInput = document.getElementById('update-todo-input');
    const updateTodoButton = document.getElementById('update-todo-button');
    const closeButton = document.querySelector('.close-button');
    
    let currentTodo = null;

    // Fetch to-do lists from the server
    fetch('/todolists')
        .then(response => response.json())
        .then(todoLists => {
            todoLists.forEach(todo => addTodoList(todo._id, todo.text));
        });

    addTodoButton.addEventListener('click', () => {
        addTodoListToServer(todoInput.value);
        todoInput.value = '';
    });

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodoListToServer(todoInput.value);
            todoInput.value = '';
        }
    });

    function addTodoList(id, text) {
        if (text.trim() === '') return;

        const listItem = document.createElement('li');
        listItem.dataset.id = id;

        const todoText = document.createElement('span');
        todoText.textContent = text;
        todoText.classList.add('task-text');
        todoText.addEventListener('click', () => {
            todoText.classList.toggle('completed');
            updateTodoCompletion(id, todoText.classList.contains('completed'));
        });

        const menu = document.createElement('span');
        menu.textContent = '⋮';
        menu.classList.add('menu');
        menu.addEventListener('click', () => {
            const menuContent = listItem.querySelector('.menu-content');
            menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
        });

        const menuContent = document.createElement('div');
        menuContent.classList.add('menu-content');

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
            currentTodo = listItem;
            updateTodoInput.value = todoText.textContent;
            updateModal.style.display = 'flex';
            menuContent.style.display = 'none';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            console.log(`Deleting to-do with id: ${id}`); // Debugging line
            deleteTodoFromServer(id);
            listItem.remove();
        });

        menuContent.appendChild(updateButton);
        menuContent.appendChild(deleteButton);
        listItem.appendChild(todoText);
        listItem.appendChild(menu);
        listItem.appendChild(menuContent);
        taskList.appendChild(listItem);
    }

    // Add to-do list to the server
    function addTodoListToServer(text) {
        if (text.trim() === '') return;

        fetch('/todolists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        })
        .then(response => response.json())
        .then(data => addTodoList(data._id, data.text));
    }

    function updateTodoCompletion(id, completed) {
        fetch(`/todolists/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
    }

    function deleteTodoFromServer(id) {
        fetch(`/todolists/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to delete to-do list item:', response.statusText); // Debugging line
            }
        });
    }

    updateTodoButton.addEventListener('click', () => {
        if (currentTodo) {
            fetch(`/todolists/${currentTodo.dataset.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: updateTodoInput.value })
            })
            .then(response => response.json())
            .then(data => {
                currentTodo.querySelector('.task-text').textContent = data.text;
                updateModal.style.display = 'none';
            });
        }
    });

    closeButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });
});
