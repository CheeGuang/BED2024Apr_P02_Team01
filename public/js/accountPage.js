//Get Local Storage
const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

// Get Sign Out btn
const signOutBtn = document.getElementById("sign-out-btn");

// Get input fields
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
      email.textContent = patientDetails.Email;
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

    // If user edited the contact info
    if (contact.value != contact.placeholder) {
      UpdateContactRecord();
    }
  } else {
    document.getElementById(iconID).className = "fa-regular fa-floppy-disk";
  }
}

// Call Controller to update the database

async function UpdateContactRecord() {
  // Make the PUT request to the API
  console.log("Patient ID: " + patientDetails.PatientID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/updateContact/${patientDetails.PatientID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact: contact.value }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      contact.placeholder = `S$${result.ContactNumber}`;
      localStorage.setItem("ContactNumber", result.ContactNumber);
    } else {
      console.error("Error updating patient", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
