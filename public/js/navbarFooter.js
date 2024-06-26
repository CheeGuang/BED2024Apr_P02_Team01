// Determine the current page's name
const pageName = window.location.pathname.split("/").pop();

// Fetch and insert the appropriate navbar HTML using JavaScript
let navbarFile;
if (pageName.includes("Login") || pageName.includes("SignUp")) {
  navbarFile = "navbar.html";
} else if (pageName.includes("patient")) {
  navbarFile = "patientNavbar.html";

  document.addEventListener("DOMContentLoaded", function () {
    // Get local storage
    const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

    // Update the html img src so profile pic changes to one in local storage
    if (patientDetails.profilePicture) {
      console.log(patientDetails.profilePicture);
      $("#profile-image-login").attr("src", patientDetails.profilePicture);
    }
  });
} else if (pageName.includes("doctor")) {
  navbarFile = "doctorNavbar.html";
} else {
  navbarFile = "navbar.html";
}

fetch(navbarFile)
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;
  })
  .catch((error) => console.error(error));

// Fetch and insert the footer HTML using JavaScript
fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  })
  .catch((error) => console.error(error));
