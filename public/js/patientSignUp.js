document
  .getElementById("signUpForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const address = document.getElementById("address").value;

    const googleUser = JSON.parse(localStorage.getItem("googleUser"));

    const newPatientData = {
      Email: email,
      ContactNumber: contactNumber,
      DOB: dob,
      Gender: gender,
      Address: address,
      eWalletAmount: 0, // Default value
      resetPasswordCode: null, // Default value
      PCHI: null, // Default value
      googleId: googleUser.googleId,
      givenName: googleUser.givenName,
      familyName: googleUser.familyName,
      profilePicture: googleUser.profilePicture, // Updated field name
    };

    fetch("/api/patient/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPatientData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error creating patient", data.error);
        } else {
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "../patientHomePage.html"; // Redirect to home page or another page after sign-up
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
