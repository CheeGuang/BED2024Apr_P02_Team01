function handleCredentialResponse(response) {
  console.log("Credential response received:", response);

  fetch("/api/patient/googleLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: response.credential }),
  })
    .then((response) => {
      console.log("Response from /api/patient/googleLogin received");
      return response.json();
    })
    .then((data) => {
      console.log("Parsed JSON data:", data);

      if (data.error) {
        console.error("Authentication failed", data.error);
      } else {
        console.log("Authentication successful, patient details:", data.user);
        localStorage.setItem("patientDetails", JSON.stringify(data.user));

        if (!data.user.Address) {
          console.log(
            "Address is null or undefined, redirecting to sign-up page"
          );
          window.location.href = "../patientSignUp.html";
        } else {
          console.log("Address is present, redirecting to home page");
          localStorage.setItem("PatientID", data.user.PatientID);
          window.location.href = "../patientHomePage.html";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.onload = function () {
  console.log("Window loaded, initializing Google ID");

  google.accounts.id.initialize({
    client_id:
      "669052276058-vlo56v1ae21jida2o982ams3rgfimajd.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });

  console.log("Rendering Google Sign-In button");

  google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
    theme: "outline",
    size: "large",
  });
};
