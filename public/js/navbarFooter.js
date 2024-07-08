// Determine the current page's name
const pageName = window.location.pathname.split("/").pop();

// Fetch and insert the appropriate navbar HTML using JavaScript
let navbarFile;
if (pageName.includes("Login") || pageName.includes("SignUp")) {
  navbarFile = "navbar.html";
} else if (pageName.includes("patient")) {
  navbarFile = "patientNavbar.html";
} else if (pageName.includes("doctor")) {
  navbarFile = "doctorNavbar.html";
} else {
  navbarFile = "navbar.html";
}

fetch(navbarFile)
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    // Check for profile picture and update src if it exists
    if (pageName.includes("patient")) {
      const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
      console.log("Patient Details:", patientDetails);
      if (patientDetails && patientDetails.profilePicture) {
        document.getElementById("profile-image-login").src =
          patientDetails.profilePicture;
        console.log(
          "Patient Profile Picture Set:",
          patientDetails.profilePicture
        );
      }
    } else if (pageName.includes("doctor")) {
      const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));
      console.log("Doctor Details:", doctorDetails);
      if (doctorDetails && doctorDetails.profilePicture) {
        document.getElementById("profile-image-login").src =
          doctorDetails.profilePicture;
        console.log(
          "Doctor Profile Picture Set:",
          doctorDetails.profilePicture
        );
      }
    }
  })
  .catch((error) => console.error("Error loading navbar:", error));

// Fetch and insert the footer HTML using JavaScript
fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  })
  .catch((error) => console.error("Error loading footer:", error));

function openAPIDoc() {
  window.location.href = window.location.origin + "/api-docs";
}
