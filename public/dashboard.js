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
