document.addEventListener('DOMContentLoaded', function() {
    const notesContainer = document.getElementById('notesContainer');
    const openAddNoteModalButton = document.getElementById('openAddNoteModalButton');
    const addNoteModal = document.getElementById('addNoteModal');
    const closeAddNoteModalButton = document.getElementById('closeAddNoteModalButton');
    const addNoteButton = document.getElementById('addNoteButton');
    const cancelAddNoteButton = document.getElementById('cancelAddNoteButton');
    const updateNoteModal = document.getElementById('updateNoteModal');
    const closeUpdateNoteModalButton = document.getElementById('closeUpdateNoteModalButton');
    const saveUpdateNoteButton = document.getElementById('saveUpdateNoteButton');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeDeleteConfirmModalButton = document.getElementById('closeDeleteConfirmModalButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    let notes = [];
    let currentNoteId = null;

    function openModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    function renderNotes() {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button class="edit-note" data-id="${note.id}">Edit</button>
                <button class="delete-note" data-id="${note.id}">Delete</button>
            `;
            notesContainer.appendChild(noteElement);
        });
    }

    function addNote(title, content) {
        const newNote = {
            id: Date.now(),
            title: title,
            content: content
        };
        notes.push(newNote);
        renderNotes();
    }

    function updateNote(id, title, content) {
        const index = notes.findIndex(note => note.id === id);
        if (index !== -1) {
            notes[index] = { ...notes[index], title, content };
            renderNotes();
        }
    }

    function deleteNote(id) {
        notes = notes.filter(note => note.id !== id);
        renderNotes();
    }

    openAddNoteModalButton.addEventListener('click', () => openModal(addNoteModal));
    closeAddNoteModalButton.addEventListener('click', () => closeModal(addNoteModal));
    cancelAddNoteButton.addEventListener('click', () => closeModal(addNoteModal));

    addNoteButton.addEventListener('click', () => {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        if (title && content) {
            addNote(title, content);
            closeModal(addNoteModal);
        }
    });

    notesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-note')) {
            currentNoteId = parseInt(e.target.getAttribute('data-id'));
            const note = notes.find(note => note.id === currentNoteId);
            document.getElementById('updateNoteTitle').value = note.title;
            document.getElementById('updateNoteContent').value = note.content;
            openModal(updateNoteModal);
        } else if (e.target.classList.contains('delete-note')) {
            currentNoteId = parseInt(e.target.getAttribute('data-id'));
            openModal(deleteConfirmModal);
        }
    });

    closeUpdateNoteModalButton.addEventListener('click', () => closeModal(updateNoteModal));
    saveUpdateNoteButton.addEventListener('click', () => {
        const title = document.getElementById('updateNoteTitle').value;
        const content = document.getElementById('updateNoteContent').value;
        if (title && content) {
            updateNote(currentNoteId, title, content);
            closeModal(updateNoteModal);
        }
    });

    closeDeleteConfirmModalButton.addEventListener('click', () => closeModal(deleteConfirmModal));
    cancelDeleteButton.addEventListener('click', () => closeModal(deleteConfirmModal));
    confirmDeleteButton.addEventListener('click', () => {
        deleteNote(currentNoteId);
        closeModal(deleteConfirmModal);
    });

    // Initial render
    renderNotes();
});