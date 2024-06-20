document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.givenName) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Welcome, Dr. ${user.givenName} ${user.lastName}!`;
  }

  document
    .getElementById("signUpForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const contactNumber = document.getElementById("contactNumber").value;
      const dob = document.getElementById("dob").value;
      const gender = document.getElementById("gender").value;
      const address = document.getElementById("address").value;
      const errorMessage = document.getElementById("errorMessage");

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

      // Create newDoctorData object
      const newDoctorData = {
        ContactNumber: contactNumber,
        DOB: dob,
        Gender: gender,
        Address: address,
        Email: user.Email,
        googleId: user.googleId,
        givenName: user.givenName,
        familyName: user.familyName,
        profilePicture: user.profilePicture,
        resetPasswordCode: null, // Default value
      };

      // Send data to server
      fetch(`/api/doctor/${user.DoctorID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctorData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Error updating doctor", data.error);
          } else {
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = "../doctorHomePage.html"; // Redirect to home page after sign-up
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
