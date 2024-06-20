// Retrieve patientDetails from localStorage
const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

// Set welcome message
document.getElementById(
  "welcomeMessage"
).textContent = `Welcome, ${patientDetails.givenName}. Please provide the following details:`;

document
  .getElementById("signUpForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const contactNumber = document.getElementById("contactNumber").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const address = document.getElementById("address").value;
    const pchi = document.getElementById("pchi").value;
    const errorMessage = document.getElementById("errorMessage");

    const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

    // Clear previous error messages
    errorMessage.classList.add("d-none");
    errorMessage.textContent = "";

    // Validate contact number
    if (!/^([89]\d{7})$/.test(contactNumber)) {
      errorMessage.textContent =
        "Contact number must start with 8 or 9 and be 8 digits.";
      errorMessage.classList.remove("d-none");
      return;
    }

    // Validate DOB
    const today = new Date().toISOString().split("T")[0];
    if (dob >= today) {
      errorMessage.textContent = "Date of Birth must be before today.";
      errorMessage.classList.remove("d-none");
      return;
    }

    // Validate PCHI
    if (parseInt(pchi) > 1200) {
      errorMessage.textContent = "PCHI must be 1200 or below.";
      errorMessage.classList.remove("d-none");
      return;
    }

    const newPatientData = {
      Email: patientDetails.Email,
      ContactNumber: contactNumber,
      DOB: dob,
      Gender: gender,
      Address: address,
      eWalletAmount: 0, // Default value
      resetPasswordCode: null, // Default value
      PCHI: pchi, // PCHI value
      googleId: patientDetails.googleId,
      givenName: patientDetails.givenName,
      familyName: patientDetails.familyName,
      profilePicture: patientDetails.profilePicture, // Updated field name
    };

    fetch(`/api/patient/${patientDetails.PatientID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPatientData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error updating patient", data.error);
        } else {
          localStorage.setItem("patientDetails", JSON.stringify(data));
          localStorage.setItem("PatientID", data.PatientID);
          window.location.href = "../patientHomePage.html"; // Redirect to home page or another page after sign-up
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
