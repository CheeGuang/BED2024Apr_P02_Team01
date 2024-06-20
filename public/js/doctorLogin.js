function handleCredentialResponse(response) {
  console.log("handleCredentialResponse called with response:", response);

  fetch("/api/doctor/googleLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: response.credential }),
  })
    .then((response) => {
      console.log("Response received from /api/doctor/googleLogin:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Data received:", data);
      if (data.error) {
        console.error("Authentication failed", data.error);
      } else {
        console.log(
          "Authentication successful, storing doctor details in localStorage"
        );
        localStorage.setItem(
          "doctorDetails",
          JSON.stringify(data.doctorDetails)
        );

        if (!data.doctorDetails.ContactNumber) {
          console.log(
            "ContactNumber is null or undefined, redirecting to doctorSignUp.html"
          );
          window.location.href = "../doctorSignUp.html";
        } else {
          console.log(
            "ContactNumber is present, redirecting to doctorHomePage.html"
          );
          window.location.href = "../doctorHomePage.html";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.onload = function () {
  console.log("Initializing Google Sign-In");
  google.accounts.id.initialize({
    client_id:
      "669052276058-vlo56v1ae21jida2o982ams3rgfimajd.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
    theme: "outline",
    size: "large",
  });
  console.log("Google Sign-In button rendered");
};
