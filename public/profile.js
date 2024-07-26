document.addEventListener('DOMContentLoaded', function() {
    const editProfileBtn = document.getElementById('edit-profile');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeBtn = editProfileModal.querySelector('.close');
    const editProfileForm = document.getElementById('editProfileForm');
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');

    editProfileBtn.onclick = function() {
        editProfileModal.style.display = "block";
    }

    closeBtn.onclick = function() {
        editProfileModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == editProfileModal) {
            editProfileModal.style.display = "none";
        }
    }

    editProfileForm.onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const name = document.getElementById('name').value;
        const profilePicture = document.getElementById('profilePicture').files[0];

        // Update profile information
        profileName.textContent = name;

        if (profilePicture) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
            }
            reader.readAsDataURL(profilePicture);
        }

        // Here you would typically send this data to your server
        // For now, we'll just close the modal
        editProfileModal.style.display = "none";
    }
});