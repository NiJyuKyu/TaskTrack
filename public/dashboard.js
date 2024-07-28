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

  

document.addEventListener('DOMContentLoaded', function() {
  // Set user profile
  const profileName = document.getElementById('profile-name');
  const profilePic = document.getElementById('profile-pic');
  profileName.textContent = 'Mae'; // Replace with actual user name
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

logoutButton.addEventListener('click', () => {
  fetch('/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      return response.json(); // Make sure to parse the response as JSON
  })
  .then(data => {
      if (data.message === 'Logged out successfully') {
          window.location.href = '/login'; // Redirect to login page
      } else {
          alert('Logout failed. Please try again.');
      }
  })
  .catch(error => {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
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


