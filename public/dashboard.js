document.addEventListener('DOMContentLoaded', () => {
    // Example tasks and projects data
    const tasks = [
        { title: 'Task 1', description: 'Description for task 1' },
        { title: 'Task 2', description: 'Description for task 2' },
    ];

    const projects = [
        { title: 'Project 1', description: 'Description for project 1' },
        { title: 'Project 2', description: 'Description for project 2' },
    ];

    const tasksList = document.querySelector('#tasks ul');
    const projectsList = document.querySelector('#projects ul');

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title}: ${task.description}`;
        tasksList.appendChild(li);
    });

    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = `${project.title}: ${project.description}`;
        projectsList.appendChild(li);
    });
});
