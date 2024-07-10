document.addEventListener("DOMContentLoaded", function() {
    // Handle form submissions for signup and login
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    function handleSignup(event) {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        fetch('https://your-flutter-backend/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showNotification('Signup successful!', 'success');
            } else {
                showNotification('Signup failed: ' + result.message, 'error');
            }
        })
        .catch(error => showNotification('Signup failed: ' + error.message, 'error'));
    }

    function handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        fetch('https://your-flutter-backend/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showNotification('Login successful!', 'success');
                // Optionally, redirect to dashboard or home page
                window.location.href = 'index.html';
            } else {
                showNotification('Login failed: ' + result.message, 'error');
            }
        })
        .catch(error => showNotification('Login failed: ' + error.message, 'error'));
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});

function navigateTo(page) {
    window.location.href = page;
}
