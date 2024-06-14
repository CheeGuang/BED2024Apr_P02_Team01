function handleCredentialResponse(response) {
  fetch("/api/auth/google", {
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
          // window.location.href = "../patientSignUp.html";
        }
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem(
          "profile",
          JSON.stringify({
            googleId: data.googleId,
            email: data.email,
            givenName: data.givenName,
            familyName: data.familyName,
            profilePicture: data.profilePicture,
          })
        );
        // window.location.href = "../patientHomePage.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: process.env.googleId,
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
    theme: "outline",
    size: "large",
  });
};
