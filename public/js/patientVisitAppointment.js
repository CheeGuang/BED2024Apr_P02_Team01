document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const patientURL = decodeURIComponent(urlParams.get("patientURL"));
  const appointmentID = urlParams.get("appointmentID");

  console.log(`Loaded appointment page for ID: ${appointmentID}`);
  if (patientURL) {
    console.log(`Setting meeting frame URL: ${patientURL}`);
    document.getElementById("meeting-frame").src = patientURL;
  } else {
    console.error("Failed to load meeting URL.");
    document.body.innerHTML = "<p>Failed to load meeting URL.</p>";
    return;
  }

  const apiBaseUrl = `${window.location.origin}/api/appointment/${appointmentID}`;

  // Fetch and display appointment details
  function fetchAppointmentDetails() {
    fetch(`${apiBaseUrl}/details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched appointment details:", data);
        document.getElementById("patientFullName").innerText =
          data.PatientFullName || "Pending";
        document.getElementById("doctorFullName").innerText =
          data.DoctorFullName || "Pending";
        document.getElementById("illnessDescription").innerText =
          data.IllnessDescription || "Pending";
        document.getElementById("diagnosis").innerText =
          data.Diagnosis || "Pending";

        // Check if all data is not null
        if (
          data.PatientFullName &&
          data.DoctorFullName &&
          data.IllnessDescription &&
          data.Diagnosis
        ) {
          document.getElementById("downloadMC").disabled = false;
          showNotification("You can now download your Medical Certificate.");
        }
      })
      .catch((error) => {
        console.error("Error fetching appointment details:", error);
      });
  }

  fetchAppointmentDetails(); // Initial fetch to display appointment details

  // Listen for updates that enable the MC button
  const eventSource = new EventSource(`${apiBaseUrl}/updates`);
  console.log(`Connecting to SSE for appointment ID: ${appointmentID}`);
  eventSource.onopen = function () {
    console.log("SSE connection opened");
  };
  eventSource.onmessage = function (event) {
    console.log("Received SSE message:", event.data);
    const updateData = JSON.parse(event.data);
    if (updateData.updatedWithMedicines) {
      console.log("Enabling download MC button");
      fetchAppointmentDetails(); // Fetch and update appointment details
    }
  };

  eventSource.onerror = function (error) {
    console.error("SSE error:", error);
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log("SSE connection closed by the server");
    }
  };

  // Add event listener to Download MC Button
  document.getElementById("downloadMC").addEventListener("click", function () {
    const mcUrl = `${apiBaseUrl}/medicalCertificate`;

    fetch(mcUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "SyncHealth-MedicalCertificate.pdf"; // you can specify a custom file name here
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading medical certificate:", error);
      });
  });

  // Function to show notification
  function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.innerText = message;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 5000);
  }
});
