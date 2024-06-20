function handleCredentialResponse(response) {
  fetch("/api/patient/googleLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: response.credential }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Authentication failed", data.error);
        if (data.error === "User not found. Redirect to sign-up.") {
          localStorage.setItem("googleUser", JSON.stringify(data));
          window.location.href = "../patientSignUp.html";
        }
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        // Redirect to home or another page
        window.location.href = "../patientHomePage.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "669052276058-vlo56v1ae21jida2o982ams3rgfimajd.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
    theme: "outline",
    size: "large",
  });
};
