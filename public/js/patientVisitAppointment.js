document.addEventListener("DOMContentLoaded", function () {
  const patientURL = localStorage.getItem("patientURL");
  if (patientURL) {
    document.getElementById("meeting-frame").src = patientURL;
  } else {
    document.body.innerHTML = "<p>Failed to load meeting URL.</p>";
  }
});
