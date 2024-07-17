const nodemailer = require("nodemailer");

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
const address = document.getElementById("autocomplete");
const gender = document.getElementById("gender");

const errorMessage = document.getElementById("errorMessage");
const dob_errorMessage = document.getElementById("dob-errorMessage");
// Function for sign out to work
signOutBtn.addEventListener("click", function () {
  // Remove patient details from local storage
  localStorage.removeItem("patientDetails");
  localStorage.removeItem("PatientJWTAuthToken");
  localStorage.removeItem("eWalletBalance");

  // Send the email here
  sendEmail();

  // Redirect to Home Page
  document.location.href = "../index.html";
});

function sendEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jeffreyleeprg2@gmail.com",
        pass: "cuhmvmdqllulsucg",
      },
    });
    const mailOptions = {
      from: "jeffreyleeprg2@gmail.com", // sender address
      to: "raeannezou@gmail.com", // list of receivers
      subject: "Sign out", // Subject line
      text: "You've been signed out!", // plain text body
    };

    const result = transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
}

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

      // Show notification
      showNotification("Name updated successfully", "success");
    } else {
      console.error("Error updating patient name", result.error);
      showNotification("An error occurred while updating name", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("An error occurred while updating name", "error");
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
      // Show notification
      showNotification("Contact updated successfully", "success");
    } else {
      console.error("Error updating patient contact", result.error);
      showNotification("An error occurred while updating birth date", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("An error occurred while updating contact", "error");
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
      // Show notification
      showNotification("Birth date updated successfully", "success");
    } else {
      console.error("Error updating patient birth date", result.error);
      showNotification("An error occurred while updating birth date", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("An error occurred while updating birth date", "error");
  }
}

let autocomplete;

// Initialize Google Places Autocomplete
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        { types: ['address'] }
    );
    autocomplete.addListener('place_changed', onPlaceChanged);
}

// Function to handle place changed event
function onPlaceChanged() {
    const place = autocomplete.getPlace();
    
    if (!place.geometry) {
        // User entered the name of a Place that was not suggested and pressed Enter
        console.error("No details available for input: '" + place.name + "'");
        return;
    }

    // Extract the address components from the place object
    let address = place.formatted_address;

    // Update the input field placeholder
    document.getElementById('autocomplete').placeholder = address;

    // Update the address in the database
    UpdateAddressRecord(address);
}

// Function to update the address record in the database
async function UpdateAddressRecord(address) {
    console.log("Updating address for Patient ID: " + patientDetails.PatientID);
    try {
        const response = await fetch(
            `${window.location.origin}/api/patient/updateAddress/${patientDetails.PatientID}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("PatientJWTAuthToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address: address }),
            }
        );

        const result = await response.json();
        console.log("Response received:", result);

        if (response.ok) {
            document.getElementById('autocomplete').placeholder = result.Address;
            patientDetails.Address = result.Address;
            localStorage.setItem("patientDetails", JSON.stringify(patientDetails));

            showNotification("Address updated successfully", "success");
        } else {
            console.error("Error updating patient address", result.error);
            showNotification("An error occurred while updating address", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showNotification("An error occurred while updating address", "error");
    }
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.className = `notification ${type} show`;
  notification.innerText = message;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000); // Show the notification for 3 seconds
}
