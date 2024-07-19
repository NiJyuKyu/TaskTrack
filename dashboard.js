document.addEventListener('DOMContentLoaded', function() {
    // Existing code for user profile and other modals

    // Notes Modal Functionality
    const noteModal = document.getElementById("note-modal");
    const openNoteModalBtn = document.getElementById("open-note-modal");
    const closeNoteModal = document.querySelector("#note-modal .close");
    const noteForm = document.getElementById("note-form");
    const notesList = document.getElementById("notes-list");

    let notes = [];

    function renderNotes() {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteItem = document.createElement("div");
            noteItem.className = "note-item";
            noteItem.setAttribute("data-id", note.id);
            noteItem.innerHTML = `
                <h3>${note.date}</h3>
                <p>${note.content}</p>
                <i class="fas fa-edit edit-note" data-id="${note.id}"></i>
                <i class="fas fa-trash delete-note" data-id="${note.id}"></i>
            `;
            notesList.appendChild(noteItem);
        });
        attachNoteListeners();
    }

    function attachNoteListeners() {
        document.querySelectorAll('.edit-note').forEach(editBtn => {
            editBtn.addEventListener('click', function() {
                const noteId = this.getAttribute('data-id');
                const note = notes.find(note => note.id === parseInt(noteId));
                document.getElementById('note-id').value = note.id;
                document.getElementById('note-date').value = note.date;
                document.getElementById('note-content').value = note.content;
                noteModal.style.display = 'block';
            });
        });

        document.querySelectorAll('.delete-note').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', function() {
                const noteId = this.getAttribute('data-id');
                notes = notes.filter(note => note.id !== parseInt(noteId));
                renderNotes();
            });
        });
    }

    openNoteModalBtn.onclick = function() {
        document.getElementById('note-form').reset();
        document.getElementById('note-id').value = '';
        noteModal.style.display = "block";
    }

    closeNoteModal.onclick = function() {
        noteModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == noteModal) {
            noteModal.style.display = "none";
        }
    }

    noteForm.onsubmit = function(event) {
        event.preventDefault();
        const noteId = document.getElementById('note-id').value;
        const noteDate = document.getElementById('note-date').value;
        const noteContent = document.getElementById('note-content').value;

        if (noteId) {
            const note = notes.find(note => note.id === parseInt(noteId));
            note.date = noteDate;
            note.content = noteContent;
        } else {
            const newNote = {
                id: notes.length ? notes[notes.length - 1].id + 1 : 1,
                date: noteDate,
                content: noteContent
            };
            notes.push(newNote);
        }

        renderNotes();
        noteModal.style.display = 'none';
    }

    // Initial render
    renderNotes();
});
