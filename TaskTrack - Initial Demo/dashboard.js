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

// Function to render tasks on the tasks page
function renderTasks() {
  const taskList = document.querySelector('.task-list');
  taskList.innerHTML = ''; // Clear previous tasks

  // Example data, replace with your own tasks array or fetch from a server
  const tasks = [
    { id: 1, title: 'Task 1', description: 'Description for Task 1' },
    { id: 2, title: 'Task 2', description: 'Description for Task 2' },
    { id: 3, title: 'Task 3', description: 'Description for Task 3' }
  ];

  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div>
        <button class="edit-task-btn" data-id="${task.id}">Edit</button>
        <button class="delete-task-btn" data-id="${task.id}">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });

  // Event listener for adding a new task
  const addTaskBtn = document.getElementById('add-task-btn');
  addTaskBtn.addEventListener('click', () => {
    const title = prompt('Enter task title:');
    if (title) {
      const newTask = {
        id: tasks.length + 1,
        title,
        description: '' // You can prompt for description as well
      };
      tasks.push(newTask);
      renderTasks();
    }
  });

  // Event listeners for edit and delete task buttons (example)
  const editButtons = document.querySelectorAll('.edit-task-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const taskId = parseInt(event.target.dataset.id);
      const taskToEdit = tasks.find(task => task.id === taskId);
      const newTitle = prompt('Enter new task title:', taskToEdit.title);
      if (newTitle) {
        taskToEdit.title = newTitle;
        renderTasks();
      }
    });
  });

  const deleteButtons = document.querySelectorAll('.delete-task-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const taskId = parseInt(event.target.dataset.id);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        renderTasks();
      }
    });
  });
}

// Initially show the overview page
pageContainers.forEach(container => {
  if (container.id === 'overview-page') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
});
