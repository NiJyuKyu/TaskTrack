const signInForm = document.getElementById('sign-in-form');

signInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '123') 
        {
        // Login successful, redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Login failed, display error message
        alert('Invalid username or password');
    }
});