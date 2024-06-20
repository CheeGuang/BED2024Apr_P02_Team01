document.addEventListener("DOMContentLoaded", function () {
  const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
  if (patientDetails && patientDetails.givenName) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Welcome, ${patientDetails.givenName}!`;
  }
});
