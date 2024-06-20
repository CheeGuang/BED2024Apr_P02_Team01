document.addEventListener("DOMContentLoaded", function () {
  const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));
  if (doctorDetails && doctorDetails.givenName) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Welcome, Dr. ${doctorDetails.givenName} ${doctorDetails.familyName}!`;
  }
});
