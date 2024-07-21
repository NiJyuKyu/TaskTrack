document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth'
    });
    calendar.render();

    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pages = {
        overview: document.getElementById('overview-page'),
        calendar: document.getElementById('calendar-page'),
        activity: document.getElementById('activity-page'),
        tasks: document.getElementById('tasks-page'),
        notes: document.getElementById('notes-page')
    };
    const headerSection = document.getElementById('header-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            for (let page in pages) {
                pages[page].style.display = 'none';
            }
            pages[item.getAttribute('data-page')].style.display = 'block';

            // Hide header for notes page
            if (item.getAttribute('data-page') === 'notes') {
                headerSection.classList.add('hidden-header');
            } else {
                headerSection.classList.remove('hidden-header');
            }
        });
    });

    // Profile modal
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileBtn = document.getElementById('edit-profile');
    const closeEditProfileModal = editProfileModal.querySelector('.close');

    editProfileBtn.onclick = function() {
        editProfileModal.style.display = 'block';
    }
    
    closeEditProfileModal.onclick = function() {
        editProfileModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == editProfileModal) {
            editProfileModal.style.display = 'none';
        }
        if (event.target == noteModal) {
            noteModal.style.display = 'none';
        }
    }

    // Note modal
    const noteModal = document.getElementById('noteModal');
    const openNoteModalBtn = document.getElementById('open-note-modal');
    const closeNoteModal = noteModal.querySelector('.close');
    const saveNoteBtn = document.getElementById('save-note-btn');

    openNoteModalBtn.onclick = function() {
        noteModal.style.display = 'block';
    }

    closeNoteModal.onclick = function() {
        noteModal.style.display = 'none';
    }

    saveNoteBtn.onclick = function() {
        // Save note logic
        noteModal.style.display = 'none';
    }
});
