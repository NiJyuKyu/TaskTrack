document.getElementById('signOutBtn').addEventListener('click', function() {
    // Clear any authentication tokens or user data
    localStorage.removeItem('authToken'); // Example: remove token from local storage
    // Add more steps here if you store user data elsewhere

    // Redirect to the sign in page
    window.location.href = 'index.html'; // Adjust the path to your sign in page
});
