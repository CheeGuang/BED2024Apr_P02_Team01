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

    //If user edited name info
    // if (
    //   inputID == "personal-name" &&
    //   personalName.value != personalName.placeholder
    // ) {
    //   //UpdateNameRecord();
    // }
    // If user edited the contact info
    if (inputID == "contact" && contact.value != contact.placeholder) {
      UpdateContactRecord();
    } else if (inputID == "address" && address.value != address.placeholder) {
      UpdateAddressRecord();
    }
  } else {
    document.getElementById(iconID).className = "fa-regular fa-floppy-disk";
  }
}

// Call Controller to update the database
async function UpdateNameRecord() {
  // Make the PUT request to the API
  console.log("Patient ID: " + patientDetails.PatientID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/updateName/${patientDetails.PatientID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: personalName.value }),
      }
    );

    const result = await response.json();

    // Write to local storage
    if (response.ok) {
      // Update UI
      personalName.placeholder = `S$${result.Name}`;
      // Update local storage
      let splitName = result.Name.split(" ");

      if (splitName.length > 1) {
        patientDetails.givenName = splitName[0];
        patientDetails.familyName = splitName[1];
      } else {
        patientDetails.givenName = result.Name;
      }
      localStorage.setItem("patientDetails", JSON.stringify(patientDetails));
    } else {
      console.error("Error updating patient name", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

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

    // Write to local storage
    if (response.ok) {
      // Update UI
      contact.placeholder = `S$${result.ContactNumber}`;
      // Update local storage
      patientDetails.ContactNumber = result.ContactNumber;
      localStorage.setItem("patientDetails", JSON.stringify(patientDetails));
    } else {
      console.error("Error updating patient contact", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// async function UpdateDOBRecord() {
//   // Make the PUT request to the API
//   console.log("Patient ID: " + patientDetails.PatientID);
//   try {
//     const response = await fetch(
//       `${window.location.origin}/api/patient/updateDOB/${patientDetails.PatientID}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ dob: dob.value }),
//       }
//     );

//     const result = await response.json();

//     // Write to local storage
//     if (response.ok) {
//       // Update UI
//       contact.placeholder = `S$${result.DOB}`;
//       // Update local storage
//       patientDetails.DOB = result.DOB;
//       localStorage.setItem("patientDetails", JSON.stringify(patientDetails));
//     } else {
//       console.error("Error updating patient birth date", result.error);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

async function UpdateAddressRecord() {
  // Make the PUT request to the API
  console.log("Patient ID: " + patientDetails.PatientID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/updateAddress/${patientDetails.PatientID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address.value }),
      }
    );

    const result = await response.json();

    // Write to local storage
    if (response.ok) {
      // Update UI
      address.placeholder = `S$${result.Address}`;
      // Update local storage
      patientDetails.Address = result.Address;
      localStorage.setItem("patientDetails", JSON.stringify(patientDetails));
    } else {
      console.error("Error updating patient address", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
