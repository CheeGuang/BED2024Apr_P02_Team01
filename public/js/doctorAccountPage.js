// Get Sign Out btn
const signOutBtn = document.getElementById("sign-out-btn");
const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));

// Getting input fields
const personalName = document.getElementById("personal-name");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const dob = document.getElementById("dob");
const gender = document.getElementById("gender");
const profession = document.getElementById("profession");

// Error Message
const errorMessage = document.getElementById("errorMessage");
const dob_errorMessage = document.getElementById("dob-errorMessage");

// Function for sign out to work
signOutBtn.addEventListener("click", function () {
  // Remove doctor details from local storage
  localStorage.removeItem("doctorDetails");

  // Redirect to Home Page
  document.location.href = "../index.html";
});

// Get the data from the local storage
document.addEventListener("DOMContentLoaded", function () {
  if (doctorDetails) {
    // Avatar
    if (doctorDetails.profilePicture) {
      $("#avatar").attr("src", doctorDetails.profilePicture);
    }

    // Doctor Name
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
      document.getElementById("contact").placeholder =
        doctorDetails.ContactNumber;
    }

    // Date of Birth
    if (doctorDetails.DOB) {
      let dateWithTime = doctorDetails.DOB;
      let dateWithoutTime = dateWithTime.split("T")[0];
      document.getElementById("dob").placeholder = dateWithoutTime;
    }

    // Gender
    if (doctorDetails.Gender) {
      document.getElementById("gender").textContent = doctorDetails.Gender;
    }

    // Profession
    if (doctorDetails.Profession) {
      document.getElementById("profession").placeholder =
        doctorDetails.Profession;
    }
  }
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
      //Edit DOB
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

      // Today
      /*const today = new Date();
      console.log("Today's date is: " + today);
      // Remove Error Message
      if (!dob_errorMessage.classList.contains("d-none")) {
        dob_errorMessage.classList.add("d-none");
      }
      if (Date.parse(dob).getFullYear() >= today.getFullYear()) {
        dob_errorMessage.textContent = "Date of Birth must be before today.";
        dob_errorMessage.classList.remove("d-none");
      } else {
        UpdateDOBRecord();
      }*/
      //Edit Profession
    } else if (
      inputID == "profession" &&
      profession.value != profession.placeholder
    ) {
      if (
        profession.value == null ||
        profession.value == "" ||
        profession.value == " "
      ) {
        // Do nothing
      } else {
        UpdateProfessionRecord();
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

async function UpdateNameRecord() {
  // Make the PUT request to the API
  console.log("Doctor ID: " + doctorDetails.DoctorID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/doctor/updateName/${doctorDetails.DoctorID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DoctorJWTAuthToken")}`,
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
      doctorDetails.givenName = result.FirstName;
      doctorDetails.familyName = result.LastName;
      localStorage.setItem("doctorDetails", JSON.stringify(doctorDetails));
    } else {
      console.error("Error updating doctor name", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function UpdateContactRecord() {
  // Make the PUT request to the API
  console.log("Doctor ID: " + doctorDetails.DoctorID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/doctor/updateContact/${doctorDetails.DoctorID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DoctorJWTAuthToken")}`,
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
      doctorDetails.ContactNumber = result.ContactNumber;
      localStorage.setItem("doctorDetails", JSON.stringify(doctorDetails));
    } else {
      console.error("Error updating doctor contact", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function UpdateDOBRecord() {
  // Make the PUT request to the API
  console.log("Doctor ID: " + doctorDetails.DoctorID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/doctor/updateDOB/${doctorDetails.DoctorID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DoctorJWTAuthToken")}`,
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
      doctorDetails.DOB = result.DOB;
      localStorage.setItem("doctorDetails", JSON.stringify(doctorDetails));
    } else {
      console.error("Error updating doctor birth date", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function UpdateProfessionRecord() {
  // Make the PUT request to the API
  console.log("Doctor ID: " + doctorDetails.DoctorID);
  try {
    const response = await fetch(
      `${window.location.origin}/api/doctor/updateProfession/${doctorDetails.DoctorID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DoctorJWTAuthToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profession: profession.value }),
      }
    );

    const result = await response.json();

    // Write to local storage
    if (response.ok) {
      // Update UI
      profession.placeholder = `S$${result.Profession}`;
      // Update local storage
      doctorDetails.Profession = result.Profession;
      localStorage.setItem("doctorDetails", JSON.stringify(doctorDetails));
    } else {
      console.error("Error updating doctor profession", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
