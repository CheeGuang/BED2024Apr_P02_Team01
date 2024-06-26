// Get Sign Out btn
const signOutBtn = document.getElementById("sign-out-btn");

// Function for sign out to work
signOutBtn.addEventListener("click", function () {
  // Remove patient details from local storage
  localStorage.removeItem("patientDetails");

  // Redirect to Home Page
  document.location.href = "../index.html";
});

// Get the data from the local storage
document.addEventListener("DOMContentLoaded", function () {
  const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

  if (patientDetails) {
    // Avatar
    if (patientDetails.profilePicture) {
      $("#avatar").attr("src", patientDetails.profilePicture);
    }

    // Patient Name
    if (patientDetails.givenName) {
      if (patientDetails.familyName) {
        document.getElementById("personal-name").textContent =
          patientDetails.givenName + ` ${patientDetails.familyName}`;
        document.getElementById("username").textContent =
          patientDetails.givenName + ` ${patientDetails.familyName}`;
      } else {
        document.getElementById("personal-name").textContent =
          patientDetails.givenName;
        document.getElementById("username").textContent =
          patientDetails.givenName;
      }
    }

    // Email
    if (patientDetails.Email) {
      document.getElementById("email").textContent = patientDetails.Email;
    }

    // Contact Number
    if (patientDetails.ContactNumber) {
      document.getElementById("contact").textContent =
        patientDetails.ContactNumber;
    }

    // Date of Birth
    if (patientDetails.DOB) {
      let dateWithTime = patientDetails.DOB;
      let dateWithoutTime = dateWithTime.split("T")[0];
      document.getElementById("dob").textContent = dateWithoutTime;
    }

    // Address
    if (patientDetails.Address) {
      document.getElementById("address").textContent = patientDetails.Address;
    }
  }
});
