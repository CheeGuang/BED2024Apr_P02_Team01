document.addEventListener("DOMContentLoaded", () => {
  // Function to check authentication status
  const checkAuthStatus = async () => {
    // List of pages to skip authentication check
    const skipAuthPages = [
      "index.html",
      "credit.html",
      "doctorLogin.html",
      "doctorSignUp.html",
      "patientLogin.html",
      "patientSignUp.html",
      "patienteWalletTopUp.html",
    ];

    // Get the current page name
    const currentPage = window.location.pathname.split("/").pop();

    // Check if redirected due to invalid JWT and show notification if flag is set
    if (sessionStorage.getItem("invalidJWT") === "true") {
      const previousPage = sessionStorage.getItem("previousPage");
      if (
        previousPage &&
        previousPage.includes("patient") &&
        localStorage.getItem("PatientJWTAuthToken")
      ) {
        displayNotification();
      } else if (
        previousPage &&
        previousPage.includes("doctor") &&
        localStorage.getItem("DoctorJWTAuthToken")
      ) {
        displayNotification();
      }
      sessionStorage.removeItem("invalidJWT");
      sessionStorage.removeItem("previousPage");
    }

    // Skip authentication check if the current page is in the skipAuthPages list
    if (skipAuthPages.includes(currentPage)) {
      return;
    }

    try {
      const token = currentPage.includes("patient")
        ? localStorage.getItem("PatientJWTAuthToken")
        : localStorage.getItem("DoctorJWTAuthToken");

      const response = await fetch("/api/checkAuth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If the response is not OK, set invalid JWT flag, store previous page and redirect to index.html
        sessionStorage.setItem("invalidJWT", "true");
        sessionStorage.setItem("previousPage", currentPage);
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      // Set invalid JWT flag, store previous page and redirect to index.html in case of an error
      sessionStorage.setItem("invalidJWT", "true");
      sessionStorage.setItem("previousPage", currentPage);
      window.location.href = "index.html";
    }
  };

  const displayNotification = () => {
    const notification = document.getElementById("notification");
    notification.style.display = "block";
    notification.style.opacity = "1";
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.style.display = "none";
      }, 300); // Match this duration with the transition duration in CSS
    }, 3000); // Show the notification for 3 seconds
  };

  checkAuthStatus();
});
