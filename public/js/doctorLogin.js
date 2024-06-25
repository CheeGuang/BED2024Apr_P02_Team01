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
        localStorage.setItem("doctorDetails", JSON.stringify(data.user));

        if (!data.user.ContactNumber) {
          console.log(
            "ContactNumber is null or undefined, redirecting to doctorSignUp.html"
          );
          window.location.href = "../doctorSignUp.html";
        } else {
          console.log(
            "ContactNumber is present, redirecting to doctorHomePage.html"
          );
          localStorage.setItem("DoctorID", data.user.DoctorID);
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

async function proceedAsGuest() {
  try {
    const response = await fetch(`${window.location.origin}/api/doctor/guest`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const doctorDetails = await response.json();
    localStorage.setItem("doctorDetails", JSON.stringify(doctorDetails));
    window.location.href = "doctorHomePage.html";
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
