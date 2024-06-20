function handleCredentialResponse(response) {
  fetch("/api/doctor/googleLogin", {
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
      } else {
        localStorage.setItem(
          "doctorDetails",
          JSON.stringify(data.doctorDetails)
        );

        if (!data.doctorDetails.Address) {
          // Redirect to sign up if address is null or undefined
          window.location.href = "../doctorSignUp.html";
        } else {
          // Redirect to home page if address is not null
          window.location.href = "../doctorHomePage.html";
        }
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
