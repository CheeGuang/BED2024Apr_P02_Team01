document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.givenName) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Welcome, ${user.givenName}!`;
  }
});
