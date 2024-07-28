document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem('userId');
    
    // Check if userId exists
    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfilePopup = document.getElementById('edit-profile-popup');
    const closeBtn = editProfilePopup.querySelector('.close');
    const editProfileForm = document.getElementById('edit-profile-form');
    const profilePicture = document.getElementById('profile-picture');
    const usernameDisplay = document.getElementById('username');
    const newUsernameInput = document.getElementById('new-username');
    const newAvatarInput = document.getElementById('new-avatar');

    // Fetch user data from the server
    fetch(`/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // If you use JWT
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(user => {
        if (user) {
            usernameDisplay.textContent = user.username;
            profilePicture.src = user.avatar || 'default-avatar.png';
            newUsernameInput.value = user.username; // Pre-fill the username input
        }
    })
    .catch(error => console.error('Error fetching user data:', error));

    // Show the edit profile popup
    editProfileBtn.addEventListener('click', function() {
        editProfilePopup.style.display = 'block';
    });

    // Close the popup when the close button is clicked
    closeBtn.addEventListener('click', function() {
        editProfilePopup.style.display = 'none';
    });

    // Close the popup when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === editProfilePopup) {
            editProfilePopup.style.display = 'none';
        }
    });

    // Handle the profile form submission
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', newUsernameInput.value);
        if (newAvatarInput.files[0]) {
            formData.append('avatar', newAvatarInput.files[0]);
        }

        fetch(`/users/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // If you use JWT
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(user => {
            if (user) {
                usernameDisplay.textContent = user.username;
                profilePicture.src = user.avatar || 'default-avatar.png';
                editProfilePopup.style.display = 'none';
            }
        })
        .catch(error => console.error('Error updating user profile:', error));
    });
});
