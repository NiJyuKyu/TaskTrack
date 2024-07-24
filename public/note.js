document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const addNoteButton = document.getElementById('addNoteButton');
    const notesContainer = document.getElementById('notesContainer');

    const updateModal = document.getElementById('updateNoteModal');
    const updateNoteTitle = document.getElementById('updateNoteTitle');
    const updateNoteContent = document.getElementById('updateNoteContent');
    const saveUpdateButton = document.getElementById('saveUpdateNoteButton');
    const cancelUpdateButton = document.getElementById('cancelUpdateNoteButton');

    let currentNote = null;

    // Load notes from the server
    fetch('/notes')
        .then(response => response.json())
        .then(notes => {
            notes.forEach(note => addNoteToDOM(note._id, note.title, note.content));
        })
        .catch(error => console.error('Error loading notes:', error));

    addNoteButton.addEventListener('click', () => {
        const title = titleInput.value;
        const content = contentInput.value;
        addNoteToServer(title, content);
        titleInput.value = ''; // Clear input fields after adding the note
        contentInput.value = '';
    });

    function addNoteToServer(title, content) {
        if (title.trim() === '' || content.trim() === '') return; // Do not add empty notes

        fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(data => addNoteToDOM(data._id, data.title, data.content))
        .catch(error => console.error('Error adding note:', error));
    }

    function addNoteToDOM(id, title, content) {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.dataset.id = id;

        noteElement.innerHTML = `
            <h3>${title}</h3>
            <p>${content}</p>
            <button class="update-note-button">Update</button>
            <button class="delete-note-button">Delete</button>
        `;

        noteElement.querySelector('.update-note-button').addEventListener('click', () => {
            currentNote = noteElement;
            updateNoteTitle.value = title;
            updateNoteContent.value = content;
            updateModal.style.display = 'block';
        });

        noteElement.querySelector('.delete-note-button').addEventListener('click', () => {
            deleteNoteFromServer(id);
            noteElement.remove();
        });

        notesContainer.appendChild(noteElement);
    }

    function deleteNoteFromServer(id) {
        fetch(`/notes/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            console.log('Note deleted successfully');
        })
        .catch(error => console.error('Error deleting note:', error));
    }

    saveUpdateButton.addEventListener('click', () => {
        if (currentNote) {
            fetch(`/notes/${currentNote.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: updateNoteTitle.value,
                    content: updateNoteContent.value
                })
            })
            .then(response => response.json())
            .then(data => {
                currentNote.querySelector('h3').textContent = data.title;
                currentNote.querySelector('p').textContent = data.content;
                updateModal.style.display = 'none';
            })
            .catch(error => console.error('Error updating note:', error));
        }
    });

    cancelUpdateButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });
});
