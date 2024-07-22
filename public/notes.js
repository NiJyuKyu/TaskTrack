document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notes-container');
    const noteForm = document.getElementById('note-form');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const noteIdInput = document.getElementById('note-id');
    
    const loadNotes = async () => {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      notesContainer.innerHTML = '';
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <button onclick="editNote('${note._id}')">Edit</button>
          <button onclick="deleteNote('${note._id}')">Delete</button>
        `;
        notesContainer.appendChild(noteElement);
      });
    };
  
    noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const note = {
        title: noteTitleInput.value,
        content: noteContentInput.value
      };
  
      if (noteIdInput.value) {
        await fetch(`/api/notes/${noteIdInput.value}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        });
      } else {
        await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        });
      }
  
      noteForm.reset();
      loadNotes();
    });
  
    window.editNote = async (id) => {
      const response = await fetch(`/api/notes/${id}`);
      const note = await response.json();
      noteIdInput.value = note._id;
      noteTitleInput.value = note.title;
      noteContentInput.value = note.content;
    };
  
    window.deleteNote = async (id) => {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      });
      loadNotes();
    };
  
    loadNotes();
  });
  