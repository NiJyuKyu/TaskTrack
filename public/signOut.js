document.addEventListener('DOMContentLoaded', function() {
    const signOutBtn = document.getElementById('signOutBtn');
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            // Call the server's logout endpoint
            fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Clear the authentication token
                    localStorage.removeItem('authToken');
                    
                    // Clear any other user-related data you might be storing
                    // For example:
                    // localStorage.removeItem('userId');
                    // localStorage.removeItem('username');
                    
                    // Redirect to the sign-in page
                    window.location.href = '/index.html'; // Adjust the path as needed
                } else {
                    console.error('Logout failed:', data.message);
                    alert('Logout failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                alert('An error occurred during logout. Please try again.');
            });
        });
    } else {
        console.warn('Sign out button not found in the DOM');
    }
});