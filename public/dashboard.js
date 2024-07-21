const navItems = document.querySelectorAll('.nav-item');
const pageContainers = document.querySelectorAll('.project-overview, .project-calendar, .project-inbox, .project-activity, .project-projects');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;

    // Remove active class from all nav items
    navItems.forEach(navItem => navItem.classList.remove('active'));

    // Add active class to clicked nav item
    item.classList.add('active');

    // Show the corresponding page
    pageContainers.forEach(container => {
      if (container.id === `${page}-page`) {
        container.style.display = 'block';
      } else {
        container.style.display = 'none';
      }
    });
  });
});

// Initially show the overview page
pageContainers.forEach(container => {
  if (container.id === 'overview-page') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
});

//calendar page
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.main-content > div');
    
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
  
        const page = item.getAttribute('data-page');
        pages.forEach(page => page.style.display = 'none');
        document.getElementById(`${page}-page`).style.display = 'block';
  
        // Initialize FullCalendar on the calendar page
        if (page === 'calendar') {
          initCalendar();
        }
      });
    });
  
    function initCalendar() {
      const calendarEl = document.getElementById('calendar');
  
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Display the calendar in month view initially
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [ // Example events, replace with your own data
          {
            title: 'Meeting',
            start: '2024-07-05T10:00:00',
            end: '2024-07-05T12:00:00'
          },
          {
            title: 'Event',
            start: '2024-07-15',
            end: '2024-07-17'
          }
          // Add more events as needed
        ]
      });
  
      calendar.render(); // Render the calendar
    }
});  

document.addEventListener('DOMContentLoaded', function() {
  // Set user profile
  const profileName = document.getElementById('profile-name');
  const profilePic = document.getElementById('profile-pic');
  profileName.textContent = 'John Doe'; // Replace with actual user name
  profilePic.src = 'path/to/profile-picture.jpg'; // Replace with actual profile picture path

  // Handle edit profile modal
  const editProfileLink = document.getElementById('edit-profile');
  const editProfileModal = document.getElementById('editProfileModal');
  const closeButton = editProfileModal.querySelector('.close');

  editProfileLink.addEventListener('click', function(e) {
      e.preventDefault();
      editProfileModal.style.display = 'block';
  });

  closeButton.addEventListener('click', function() {
      editProfileModal.style.display = 'none';
  });

  window.addEventListener('click', function(e) {
      if (e.target == editProfileModal) {
          editProfileModal.style.display = 'none';
      }
  });

  // Handle navigation
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('[id$="-page"]');

  navItems.forEach(item => {
      item.addEventListener('click', function() {
          const pageId = this.getAttribute('data-page') + '-page';
          pages.forEach(page => {
              page.style.display = page.id === pageId ? 'block' : 'none';
          });
          navItems.forEach(navItem => navItem.classList.remove('active'));
          this.classList.add('active');
      });
  });

  // Initialize calendar
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      // Add more calendar options as needed
  });
  calendar.render();

  // Handle add task button
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.querySelector('.task-list');

  addTaskBtn.addEventListener('click', function() {
      const taskItem = document.createElement('div');
      taskItem.className = 'task-item';
      taskItem.innerHTML = `
          <input type="checkbox">
          <span contenteditable="true">New Task</span>
          <button class="delete-task">Delete</button>
      `;
      taskList.appendChild(taskItem);

      const deleteBtn = taskItem.querySelector('.delete-task');
      deleteBtn.addEventListener('click', function() {
          taskList.removeChild(taskItem);
      });
  });

  // Handle edit profile form submission
  const editProfileForm = document.getElementById('editProfileForm');
  editProfileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      // Here you would typically send this data to your server
      console.log('Form submitted with data:', Object.fromEntries(formData));
      editProfileModal.style.display = 'none';
  });
});

navItems = document.querySelectorAll('.nav-item');
pageContainers = document.querySelectorAll('.project-overview, .project-calendar, .project-activity, .project-projects, .project-tasks');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;

    // Remove active class from all nav items
    navItems.forEach(navItem => navItem.classList.remove('active'));

    // Add active class to clicked nav item
    item.classList.add('active');

    // Show the corresponding page
    pageContainers.forEach(container => {
      if (container.id === `${page}-page`) {
        container.style.display = 'block';
        if (page === 'tasks') {
          renderTasks(); // Function to render tasks on tasks page
        }
      } else {
        container.style.display = 'none';
      }
    });
  });
});

// Initially show the overview page
pageContainers.forEach(container => {
  if (container.id === 'overview-page') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
});

// User authentication
let currentUser = null;

// Function to check if user is logged in
function checkAuth() {
    // Make an API call to your server to check if the user is authenticated
    fetch('/api/check-auth')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                currentUser = data.user;
                updateProfileDisplay();
            } else {
                // Redirect to login page if not authenticated
                window.location.href = '/login';
            }
        });
}

// Function to update profile display
function updateProfileDisplay() {
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-pic').src = currentUser.profilePicture || '/default-profile-pic.png';
}

// Function to handle logout
document.addEventListener('DOMContentLoaded', function() {
  // Handle logout
    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        fetch('/api/logout', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    // Clear any client-side stored data
                    localStorage.removeItem('userToken'); // Example for token-based authentication
                    sessionStorage.clear(); // Clear session storage if needed

                    // Redirect to login page
                    window.location.href = '/login'; // Replace with your actual login page URL
                } else {
                    // Handle error case if needed
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    });
});


// Edit profile modal
const modal = document.getElementById('edit-profile-modal');
const editProfileBtn = document.getElementById('edit-profile');
const closeBtn = document.getElementsByClassName('close')[0];

editProfileBtn.onclick = () => {
    modal.style.display = 'block';
    // Populate form with current user data
    document.getElementById('username').value = currentUser.username;
    document.getElementById('name').value = currentUser.name;
}

closeBtn.onclick = () => {
    modal.style.display = 'none';
}

// Handle profile edit form submission
document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    fetch('/api/update-profile', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = data.user;
            updateProfileDisplay();
            modal.style.display = 'none';
        } else {
            alert('Failed to update profile. Please try again.');
        }
    });
});

// Call checkAuth when the page loads
window.addEventListener('load', checkAuth);

// Get the button that opens the modal
var btn = document.getElementById("edit-profile");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle form submission
document.getElementById("editProfileForm").onsubmit = function(e) {
  e.preventDefault();
  // Add your form submission logic here
  // You can use FormData to handle file uploads
  var formData = new FormData(this);
  
  // Example: Send formData to your server
  fetch('/api/update-profile', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      alert('Profile updated successfully');
      modal.style.display = "none";
      // Update the UI with new profile data
    } else {
      alert('Failed to update profile');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while updating the profile');
  });
}

document.addEventListener('DOMContentLoaded', function() {
    const editProfileLink = document.getElementById('edit-profile');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeButton = editProfileModal.querySelector('.close');

    editProfileLink.addEventListener('click', function(e) {
        e.preventDefault();
        editProfileModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        editProfileModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });
});