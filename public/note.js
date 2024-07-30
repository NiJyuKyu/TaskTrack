document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('addNoteButton');
    const notesContainer = document.getElementById('notesContainer');
    const addNoteModal = document.getElementById('addNoteModal');
    const updateNoteModal = document.getElementById('updateNoteModal');
    const modalOverlay = document.getElementById('modal-overlay');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const updateNoteTitle = document.getElementById('updateNoteTitle');
    const updateNoteContent = document.getElementById('updateNoteContent');
    const saveUpdateNoteButton = document.getElementById('saveUpdateNoteButton');
    const cancelAddNoteButton = document.getElementById('cancelAddNoteButton');
    const closeAddNoteModalButton = document.getElementById('closeAddNoteModalButton');
    const closeUpdateNoteModalButton = document.getElementById('closeUpdateNoteModalButton');
    const cancelUpdateNoteButton = document.getElementById('cancelUpdateNoteButton');
    const openAddNoteModalButton = document.getElementById('openAddNoteModalButton');
    
    let currentNote = null;

    // Load notes from the server
    loadNotes();

    // Event listener to open the add note modal
    openAddNoteModalButton.addEventListener('click', openAddNoteModal);

    // Event listener to save or add a note
    addNoteButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent event from bubbling up
        const newNote = {
            title: noteTitle.value,
            content: noteContent.value
        };
        addNoteToServer(newNote);
    });

    // Event listener to save updates to a note
    saveUpdateNoteButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent event from bubbling up
        const updatedNote = {
            title: updateNoteTitle.value,
            content: updateNoteContent.value
        };
        if (currentNote) {
            updateNoteOnServer(currentNote.dataset.id, updatedNote);
        }
    });

    // Event listeners for canceling and closing modals
    cancelAddNoteButton.addEventListener('click', closeAddNoteModal);
    closeAddNoteModalButton.addEventListener('click', closeAddNoteModal);
    closeUpdateNoteModalButton.addEventListener('click', closeUpdateNoteModal);
    cancelUpdateNoteButton.addEventListener('click', closeUpdateNoteModal);

    // Event listener to close modal when clicking outside
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeAddNoteModal();
            closeUpdateNoteModal();
        }
    });

    // Prevent clicks inside the modal from closing it
    addNoteModal.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    updateNoteModal.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    function loadNotes() {
        fetch('/notes')
            .then(response => response.json())
            .then(notes => {
                notesContainer.innerHTML = ''; // Clear existing notes
                notes.forEach(note => addNoteToDOM(note._id, note.title, note.content));
            })
            .catch(error => console.error('Error loading notes:', error));
    }

    function addNoteToServer(note) {
        fetch('/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        })
        .then(response => response.json())
        .then(data => {
            addNoteToDOM(data._id, data.title, data.content);
            closeAddNoteModal();
            clearForm();
        })
        .catch(error => console.error('Error adding note:', error));
    }

    function updateNoteOnServer(id, note) {
        fetch(`/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        })
        .then(response => response.json())
        .then(data => {
            updateNoteInDOM(data);
            closeUpdateNoteModal();
        })
        .catch(error => console.error('Error updating note:', error));
    }

    function deleteNoteFromServer(id) {
        fetch(`/notes/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            document.querySelector(`li[data-id="${id}"]`).remove();
        })
        .catch(error => console.error('Error deleting note:', error));
    }

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
            }
        });

        notesContainer.appendChild(noteElement);
    }

    function updateNoteInDOM(note) {
        const noteElement = document.querySelector(`li[data-id="${note._id}"]`);
        if (noteElement) {
            noteElement.querySelector('.note-title').textContent = note.title;
            noteElement.querySelector('.note-content').textContent = note.content;
        }
    }

    function openAddNoteModal() {
        addNoteModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    function closeAddNoteModal() {
        addNoteModal.style.display = 'none';
        modalOverlay.style.display = 'none';
        clearForm();
    }

    function openUpdateNoteModal() {
        updateNoteModal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    function closeUpdateNoteModal() {
        updateNoteModal.style.display = 'none';
        modalOverlay.style.display = 'none';
        clearForm();
    }

    function clearForm() {
        noteTitle.value = '';
        noteContent.value = '';
        updateNoteTitle.value = '';
        updateNoteContent.value = '';
    }
});