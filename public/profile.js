document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userID");
    fetchUserData(userId);
  
    document.getElementById("profile-update-form").addEventListener("submit", handleProfileUpdate);
    document.getElementById("profile-picture").addEventListener("change", handleFileChange);
  });
  
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`);
      const data = await response.json();
  
      document.getElementById("user-avatar").src = `http://localhost:5000${data.profilePicture}`;
      document.getElementById("user-name").textContent = `${data.firstName} ${data.lastName}`;
  
      document.getElementById("first-name").value = data.firstName;
      document.getElementById("last-name").value = data.lastName;
      document.getElementById("course-year").value = data.courseYear;
      document.getElementById("image-preview").src = data.profilePicture;
  
      if (!data.profilePicture) {
        document.getElementById("default-avatar").textContent = data.firstName.charAt(0).toUpperCase();
        document.getElementById("user-avatar").style.display = "none";
        document.getElementById("default-avatar").style.display = "flex";
      } else {
        document.getElementById("user-avatar").style.display = "block";
        document.getElementById("default-avatar").style.display = "none";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem("userID");
    const formData = new FormData();
    formData.append("firstName", document.getElementById("first-name").value);
    formData.append("lastName", document.getElementById("last-name").value);
    formData.append("courseYear", document.getElementById("course-year").value);
  
    const profilePictureInput = document.getElementById("profile-picture");
    if (profilePictureInput.files.length > 0) {
      const file = profilePictureInput.files[0];
      formData.append("profilePicture", file, "profile.jpg");
    }
  
    try {
      const response = await fetch(`http://localhost:5000/update-profile/${userId}`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        document.getElementById("image-preview").src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const openUserRolesModal = () => {
    document.getElementById("user-roles-modal").style.display = "block";
  };
  
  const closeUserRolesModal = () => {
    document.getElementById("user-roles-modal").style.display = "none";
  };
  