document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('addNoteButton');
    const notesContainer = document.getElementById('notesContainer');
    const addNoteModal = document.getElementById('addNoteModal');
    const updateNoteModal = document.getElementById('updateNoteModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const updateNoteTitle = document.getElementById('updateNoteTitle');
    const updateNoteContent = document.getElementById('updateNoteContent');
    const saveUpdateButton = document.getElementById('saveUpdateButton');
    const cancelAddNoteButton = document.getElementById('cancelAddNoteButton');
    const closeAddNoteModalButton = document.getElementById('closeAddNoteModalButton');
    const closeUpdateNoteModalButton = document.getElementById('closeUpdateNoteModalButton');
    const cancelUpdateNoteButton = document.getElementById('cancelUpdateNoteButton');

    let currentNote = null;

    // Load notes from the server
    fetch('/notes')
        .then(response => response.json())
        .then(notes => {
            notes.forEach(note => addNoteToDOM(note._id, note.title, note.content));
        })
        .catch(error => console.error('Error loading notes:', error));

    // Event listener to open the add note modal
    document.getElementById('openAddNoteModalButton').addEventListener('click', () => {
        currentNote = null; // Ensure we're adding a new note, not updating
        clearForm();
        openAddNoteModal();
    });

    // Function to open the add note modal
    function openAddNoteModal() {
        addNoteModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    // Function to close the add note modal
    function closeAddNoteModal() {
        addNoteModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    // Function to open the update note modal
    function openUpdateNoteModal() {
        updateNoteModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    // Function to close the update note modal
    function closeUpdateNoteModal() {
        updateNoteModal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    // Function to clear the form
    function clearForm() {
        noteTitle.value = '';
        noteContent.value = '';
        updateNoteTitle.value = '';
        updateNoteContent.value = '';
    }

    // Event listener to save or update a note
    addNoteButton.addEventListener('click', () => {
        const newNote = {
            title: noteTitle.value,
            content: noteContent.value
        };

        if (currentNote) {
            // Update existing note
            fetch(`/notes/${currentNote.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNote)
            })
            .then(response => response.json())
            .then(data => {
                updateNoteInDOM(data);
                closeAddNoteModal();
            })
            .catch(error => console.error('Error updating note:', error));
        } else {
            // Add new note
            addNoteToServer(newNote);
            closeAddNoteModal();
        }
    });

    // Event listener to save changes in the update note modal
    saveUpdateButton.addEventListener('click', () => {
        const updatedNote = {
            title: updateNoteTitle.value,
            content: updateNoteContent.value
        };

        if (currentNote) {
            // Update existing note
            fetch(`/notes/${currentNote.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedNote)
            })
            .then(response => response.json())
            .then(data => {
                updateNoteInDOM(data);
                closeUpdateNoteModal();
            })
            .catch(error => console.error('Error updating note:', error));
        }
    });

    // Event listener to cancel the add note
    cancelAddNoteButton.addEventListener('click', closeAddNoteModal);
    closeAddNoteModalButton.addEventListener('click', closeAddNoteModal);
    closeUpdateNoteModalButton.addEventListener('click', closeUpdateNoteModal);
    cancelUpdateNoteButton.addEventListener('click', closeUpdateNoteModal);

    // Event listener to close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeAddNoteModal();
            closeUpdateNoteModal();
        }
    });

    // Function to add a note to the server
    function addNoteToServer(note) {
        fetch('/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        })
        .then(response => response.json())
        .then(data => {
            addNoteToDOM(data._id, data.title, data.content);
        })
        .catch(error => console.error('Error adding note:', error));
    }

    // Function to update a note in the DOM
    function updateNoteInDOM(note) {
        const noteElement = document.querySelector(`li[data-id="${note._id}"]`);
        noteElement.querySelector('.note-title').textContent = note.title;
        noteElement.querySelector('.note-content').textContent = note.content;
    }

    // Function to add a note to the DOM
    function addNoteToDOM(id, title, content) {
        const noteElement = document.createElement('li');
        noteElement.dataset.id = id;

        noteElement.innerHTML = `
            <div class="note">
                <div class="note-header">
                    <h3 class="note-title">${title}</h3>
                </div>
                <p class="note-content">${content}</p>

                <button class="update-note-button">Update</button>
                <button class="delete-note-button">Delete</button>
            </div>
        `;

        noteElement.querySelector('.update-note-button').addEventListener('click', () => {
            currentNote = noteElement;
            updateNoteTitle.value = title;
            updateNoteContent.value = content;
            openUpdateNoteModal();
        });

        noteElement.querySelector('.delete-note-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this note?')) {
                deleteNoteFromServer(id);
                noteElement.remove();
            }
        });

        notesContainer.appendChild(noteElement);
    }

    // Function to delete a note from the server
    function deleteNoteFromServer(id) {
        fetch(`/notes/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
        })
        .catch(error => console.error('Error deleting note:', error));
    }
});
