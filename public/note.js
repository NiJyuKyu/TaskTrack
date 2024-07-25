document.addEventListener('DOMContentLoaded', () => {
    const openAddNoteModalButton = document.getElementById('openAddNoteModalButton');
    const addNoteModal = document.getElementById('addNoteModal');
    const closeAddNoteModalButton = document.getElementById('closeAddNoteModalButton');
    const addNoteButton = document.getElementById('addNoteButton');
    const noteTitleInput = document.getElementById('noteTitle');
    const noteDescriptionInput = document.getElementById('noteDescription');
    const notesContainer = document.getElementById('notesContainer');
  
    const updateNoteModal = document.getElementById('updateNoteModal');
    const closeUpdateNoteModalButton = document.getElementById('closeUpdateNoteModalButton');
    const saveUpdateButton = document.getElementById('saveUpdateButton');
    const updateNoteTitle = document.getElementById('updateNoteTitle');
    const updateNoteDescription = document.getElementById('updateNoteDescription');
  
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeDeleteConfirmModalButton = document.getElementById('closeDeleteConfirmModalButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
  
    let currentNote = null;
    let noteToDelete = null;
  
    // Open Add Note Modal
    openAddNoteModalButton.addEventListener('click', () => {
      addNoteModal.style.display = 'block';
      noteTitleInput.focus(); // Set focus on title input
    });
  
    // Close Add Note Modal
    closeAddNoteModalButton.addEventListener('click', () => {
      addNoteModal.style.display = 'none';
      noteTitleInput.value = ''; // Clear title input
      noteDescriptionInput.value = ''; // Clear description input
    });
  
    // Add Note
    addNoteButton.addEventListener('click', () => {
      const title = noteTitleInput.value.trim();
      const description = noteDescriptionInput.value.trim();
      if (title && description) {
        addNoteToServer(title, description)
          .then(() => {
            noteTitleInput.value = ''; // Clear title input
            noteDescriptionInput.value = ''; // Clear description input
            addNoteModal.style.display = 'none';
          })
          .catch((error) => console.error('Error adding note:', error));
      }
    });
  
    function addNoteToServer(title, description) {
      return fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data._id && data.title && data.description) {
            addNoteToDOM(data._id, data.title, data.description);
          } else {
            console.error('Invalid data received from server:', data);
          }
        });
    }
  
    function addNoteToDOM(id, title, description) {
      const noteElement = document.createElement('li');
      noteElement.classList.add('note');
      noteElement.dataset.id = id;
  
      noteElement.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <button class="update-note-button">Update</button>
        <button class="delete-note-button">Delete</button>
      `;
  
      noteElement.querySelector('.update-note-button').addEventListener('click', () => {
        currentNote = noteElement;
        updateNoteTitle.value = title;
        updateNoteDescription.value = description;
        updateNoteModal.style.display = 'block';
      });
  
      noteElement.querySelector('.delete-note-button').addEventListener('click', () => {
        noteToDelete = noteElement;
        deleteConfirmModal.style.display = 'block';
      });
  
      notesContainer.appendChild(noteElement);
    }
  
    // Close Update Note Modal
    closeUpdateNoteModalButton.addEventListener('click', () => {
      updateNoteModal.style.display = 'none';
    });
  
    // Update Note
    saveUpdateButton.addEventListener('click', () => {
      if (currentNote) {
        const title = updateNoteTitle.value.trim();
        const description = updateNoteDescription.value.trim();
        updateNoteOnServer(currentNote.dataset.id, title, description)
          .then(() => {
            currentNote.querySelector('h3').textContent = title;
            currentNote.querySelector('p').textContent = description;
            updateNoteModal.style.display = 'none';
          })
          .catch((error) => console.error('Error updating note:', error));
      }
    });
  
    function updateNoteOnServer(id, title, description) {
      return fetch(`/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.title && data.description) {
            return data;
          } else {
            console.error('Invalid data received from server:', data);
            throw new Error('Invalid data');
          }
        });
    }
  
    // Close Delete Confirmation Modal
    closeDeleteConfirmModalButton.addEventListener('click', () => {
      deleteConfirmModal.style.display = 'none';
    });
  
    // Confirm Delete
    confirmDeleteButton.addEventListener('click', () => {
      if (noteToDelete) {
        deleteNoteOnServer(noteToDelete.dataset.id)
          .then(() => {
            noteToDelete.remove();
            deleteConfirmModal.style.display = 'none';
          })
          .catch((error) => console.error('Error deleting note:', error));
      }
    });
  
    function deleteNoteOnServer(id) {
      return fetch(`/notes/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        });
    }
  
    // Cancel Delete
    cancelDeleteButton.addEventListener('click', () => {
      deleteConfirmModal.style.display = 'none';
    });
  
    // Close modals when clicking outside of them
    window.addEventListener('click', (event) => {
      if (event.target === addNoteModal) {
        addNoteModal.style.display = 'none';
      } else if (event.target === updateNoteModal) {
        updateNoteModal.style.display = 'none';
      } else if (event.target === deleteConfirmModal) {
        deleteConfirmModal.style.display = 'none';
      }
    });
});
