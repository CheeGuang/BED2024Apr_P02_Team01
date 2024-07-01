// Get Sign Out btn
const signOutBtn = document.getElementById("sign-out-btn");

const personalName = document.getElementById("personal-name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const dob = document.getElementById("dob");
const address = document.getElementById("address");
const gender = document.getElementById("gender");

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
        personalName.placeholder =
          patientDetails.givenName + ` ${patientDetails.familyName}`;
        username.textContent =
          patientDetails.givenName + ` ${patientDetails.familyName}`;
      } else {
        personalName.placeholder = patientDetails.givenName;
        username.textContent = patientDetails.givenName;
      }
    }

    // Email
    if (patientDetails.Email) {
      email.placeholder = patientDetails.Email;
    }

    // Contact Number
    if (patientDetails.ContactNumber) {
      contact.placeholder = patientDetails.ContactNumber;
    }

    // Date of Birth
    if (patientDetails.DOB) {
      let dateWithTime = patientDetails.DOB;
      let dateWithoutTime = dateWithTime.split("T")[0];
      dob.placeholder = dateWithoutTime;
    }

    // Address
    if (patientDetails.Address) {
      address.placeholder = patientDetails.Address;
    }

    // Gender
    if (patientDetails.Gender) {
      gender.placeholder = patientDetails.Gender;
    }
  }

  // Make text editable
});

// Toggle Input Editable and Disabled Mode
function ToggleEditableMode(iconID, inputID) {
  const ipControl = document.getElementById(inputID);

  ipControl.disabled = !ipControl.disabled;

  if (ipControl.disabled) {
    document.getElementById(iconID).className = "fa fa-pencil-square-o";
  } else {
    document.getElementById(iconID).className = "fa-regular fa-floppy-disk";
  }
}
