function handleCredentialResponse(response) {
  const token = response.credential;

  fetch("/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
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
    client_id: process.env.googleClientId,
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
    theme: "outline",
    size: "large",
  });
};
