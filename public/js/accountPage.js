//Get Local Storage
const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

// Get Sign Out btn
const signOutBtn = document.getElementById("sign-out-btn");

// Get input fields
const personalName = document.getElementById("personal-name");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const dob = document.getElementById("dob");
const address = document.getElementById("address");
const gender = document.getElementById("gender");

const errorMessage = document.getElementById("errorMessage");
const dob_errorMessage = document.getElementById("dob-errorMessage");
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
        personalName.textContent =
          patientDetails.givenName + ` ${patientDetails.familyName}`;
        // Input fields
        fname.placeholder = patientDetails.givenName;
        lname.placeholder = patientDetails.familyName;
        // Top Header
        username.textContent =
          patientDetails.givenName + ` ${patientDetails.familyName}`;
      } else {
        personalName.textContent = patientDetails.givenName;
        // Input fields
        fname.placeholder = patientDetails.givenName;
        // Top header
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
    if (inputID == "contact" && contact.value != contact.placeholder) {
      // Remove Error Message
      if (!errorMessage.classList.contains("d-none")) {
        errorMessage.classList.add("d-none");
      }
      if (
        contact.value == " " ||
        contact.value == null ||
        contact.value == ""
      ) {
        // Make no changes
      } else if (!/^([89]\d{7})$/.test(contact.value)) {
        // Validate contact number
        errorMessage.textContent =
          "Contact number must start with 8 or 9 and be 8 digits.";
        errorMessage.classList.remove("d-none");
      } else {
        UpdateContactRecord();
      }
    } else if (inputID == "dob" && dob.value != dob.placeholder) {
      if (!dob_errorMessage.classList.contains("d-none")) {
        dob_errorMessage.classList.add("d-none");
      } else {
        const todayDate = new Date();
        const datePickerValue = new Date(dob.value);
        if (todayDate < datePickerValue) {
          dob_errorMessage.textContent = "Date of Birth must be before today.";
          dob_errorMessage.classList.remove("d-none");
        } else {
          UpdateDOBRecord();
        }
      }
    } else if (inputID == "address" && address.value != address.placeholder) {
      if (
        address.value == null ||
        address.value == "" ||
        address.value == " "
      ) {
        // Do nothing
      } else {
        UpdateAddressRecord();
      }
    }
  } else {
    document.getElementById(iconID).className = "fa-regular fa-floppy-disk";
  }
}

function ToggleEditableName() {
  personalName_Style = getComputedStyle(personalName);

  if (personalName_Style.display == "block") {
    // Change to editable mode
    document.getElementById("name-icon").className =
      "fa-regular fa-floppy-disk";
    personalName.style.display = "none";
    fname.style.display = "block";
    lname.style.display = "block";
  } else {
    // Change to not editable mode
    document.getElementById("name-icon").className = "fa fa-pencil-square-o";
    personalName.style.display = "block";
    fname.style.display = "none";
    lname.style.display = "none";

    // Save changes
    if (fname.value != fname.placeholder || lname.value != lname.placeholder) {
      UpdateNameRecord();
    }
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
          Authorization: `Bearer ${localStorage.getItem(
            "PatientJWTAuthToken"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fname: fname.value, lname: lname.value }),
      }
    );

    const result = await response.json();

    // Write to local storage
    if (response.ok) {
      // Update UI
      personalName.textContent = result.FirstName + ` ${result.LastName}`;
      username.textContent = result.FirstName + ` ${result.LastName}`;

      // Update local storage
      patientDetails.givenName = result.FirstName;
      patientDetails.familyName = result.LastName;
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
          Authorization: `Bearer ${localStorage.getItem(
            "PatientJWTAuthToken"
          )}`,
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

async function UpdateDOBRecord() {
  // Make the PUT request to the API
  console.log("Patient ID: " + patientDetails.PatientID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/updateDOB/${patientDetails.PatientID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "PatientJWTAuthToken"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dob: dob.value }),
      }
    );

    const result = await response.json();

    // Write to local storage
    if (response.ok) {
      // Update UI
      dob.placeholder = `S$${result.DOB}`;
      // Update local storage
      patientDetails.DOB = result.DOB;
      localStorage.setItem("patientDetails", JSON.stringify(patientDetails));
    } else {
      console.error("Error updating patient birth date", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function UpdateAddressRecord() {
  // Make the PUT request to the API
  console.log("Patient ID: " + patientDetails.PatientID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/updateAddress/${patientDetails.PatientID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "PatientJWTAuthToken"
          )}`,
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
