// Get Sign Out btn
const signOutBtn = document.getElementById("sign-out-btn");

// Function for sign out to work
signOutBtn.addEventListener("click", function () {
  // Remove patient details from local storage
  localStorage.removeItem("doctorDetails");

  // Redirect to Home Page
  document.location.href = "../index.html";
});

// Get the data from the local storage
document.addEventListener("DOMContentLoaded", function () {
  const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));

  if (doctorDetails) {
    // Avatar
    if (doctorDetails.profilePicture) {
      $("#avatar").attr("src", doctorDetails.profilePicture);
    }

    // Patient Name
    if (doctorDetails.givenName) {
      if (doctorDetails.familyName) {
        document.getElementById("personal-name").textContent =
          doctorDetails.givenName + ` ${doctorDetails.familyName}`;
        document.getElementById("username").textContent =
          doctorDetails.givenName + ` ${doctorDetails.familyName}`;
      } else {
        document.getElementById("personal-name").textContent =
          doctorDetails.givenName;
        document.getElementById("username").textContent =
          doctorDetails.givenName;
      }
    }

    // Email
    if (doctorDetails.Email) {
      document.getElementById("email").textContent = doctorDetails.Email;
    }

    // Contact Number
    if (doctorDetails.ContactNumber) {
      document.getElementById("contact").textContent =
        doctorDetails.ContactNumber;
    }

    // Date of Birth
    if (doctorDetails.DOB) {
      let dateWithTime = doctorDetails.DOB;
      let dateWithoutTime = dateWithTime.split("T")[0];
      document.getElementById("dob").textContent = dateWithoutTime;
    }

    // Gender
    if (doctorDetails.Gender) {
      document.getElementById("gender").textContent = doctorDetails.Gender;
    }

    // Address
    if (doctorDetails.Profession) {
      document.getElementById("profession").textContent =
        doctorDetails.Profession;
    }
  }
});
