document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event triggered");

  // Get PatientID from local storage
  const PatientID = localStorage.getItem("PatientID");
  console.log("Retrieved PatientID from localStorage:", PatientID);

  // Dynamically get the current website's domain
  const baseUrl = window.location.origin;
  console.log("Base URL:", baseUrl);

  // Fetch all patient appointments that match PatientID
  fetch(`${baseUrl}/api/appointment/getByPatientID/${PatientID}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched appointment data:", data);

      // Get the containers
      const todayContainer = document.getElementById("today-appointments");
      const upcomingContainer = document.getElementById(
        "upcoming-appointments"
      );
      const historyContainer = document.getElementById("history-appointments");

      // Clear default "No Appointments" text
      todayContainer.innerHTML = "";
      upcomingContainer.innerHTML = "";
      historyContainer.innerHTML = "";

      // Get the current date and time
      const now = new Date();
      console.log("Current date and time:", now);

      // Function to create a card
      const createCard = (appointment, category) => {
        console.log(`Creating card for category: ${category}`, appointment);

        const card = document.createElement("div");
        card.className = `card card-custom card-${category} card-equal-height`;

        const startDateTime = new Date(
          appointment.StartDateTime
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const formattedDate = new Date(
          appointment.StartDateTime
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        const illnessDescription = appointment.IllnessDescription
          ? appointment.IllnessDescription.length > 14
            ? appointment.IllnessDescription.substring(0, 14) + "..."
            : appointment.IllnessDescription
          : "NIL";

        card.innerHTML = `
                <div class="card-body">
                  <div class="icon-container">
                    <i class="fas fa-calendar-alt"></i>
                    <strong>${formattedDate}</strong>
                  </div>
                  <span class="date-time">Time: ${startDateTime}</span>
                  <span>Description: ${illnessDescription}</span>
                  <div class="btn-container">
                    ${
                      category !== "history"
                        ? '<button class="btn btn-dark btn-custom cancel-button" data-id="' +
                          appointment.AppointmentID +
                          '">Cancel</button>'
                        : ""
                    }
                    ${
                      category === "today"
                        ? '<button class="btn btn-dark btn-custom join-meeting-button" data-id="' +
                          appointment.AppointmentID +
                          '">Join Meeting</button>'
                        : ""
                    }
                    ${
                      category === "upcoming"
                        ? '<button class="btn btn-dark btn-custom">Reschedule</button>'
                        : ""
                    }
                    ${
                      category === "history"
                        ? '<a href="#" class="btn btn-dark btn-custom btn-download"><i class="fas fa-download"></i> Download MC</a>'
                        : ""
                    }
                  </div>
                </div>
              `;
        return card;
      };

      // Categorize appointments
      data.forEach((appointment) => {
        // Calculate StartDateTime as EndDateTime - 2hrs
        const endDateTime = new Date(appointment.endDateTime);
        const startDateTime = new Date(endDateTime.getTime() - 60 * 60 * 1000);
        appointment.StartDateTime = startDateTime;
        console.log("Calculated StartDateTime:", startDateTime);

        if (startDateTime < now && endDateTime < now) {
          console.log("Appointment categorized as history");
          historyContainer.appendChild(createCard(appointment, "history"));
        } else if (startDateTime.toDateString() === now.toDateString()) {
          console.log("Appointment categorized as today");
          todayContainer.appendChild(createCard(appointment, "today"));
        } else {
          console.log("Appointment categorized as upcoming");
          upcomingContainer.appendChild(createCard(appointment, "upcoming"));
        }
      });

      // Display "No Appointments" if no appointments found
      if (!todayContainer.hasChildNodes()) {
        todayContainer.innerHTML = "<span>No Appointments</span>";
      }
      if (!upcomingContainer.hasChildNodes()) {
        upcomingContainer.innerHTML = "<span>No Appointments</span>";
      }
      if (!historyContainer.hasChildNodes()) {
        historyContainer.innerHTML = "<span>No Appointments</span>";
      }

      // Add event listeners for Cancel buttons
      document.querySelectorAll(".cancel-button").forEach((button) => {
        button.addEventListener("click", function () {
          const appointmentID = this.getAttribute("data-id");
          console.log(
            "Cancel button clicked for appointmentID:",
            appointmentID
          );
          showLoading();
          fetch(`${baseUrl}/api/appointment/${appointmentID}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.ok) {
                console.log("Appointment successfully canceled");
                hideLoading();
                showNotification(
                  "Appointment successfully canceled!",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                console.error("Failed to cancel appointment");
                hideLoading();
                showNotification(
                  "Failed to cancel appointment. Please try again.",
                  "error"
                );
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              hideLoading();
              showNotification(
                "Failed to cancel appointment. Please try again.",
                "error"
              );
            });
        });
      });

      // Add event listeners for Join Meeting buttons
      document.querySelectorAll(".join-meeting-button").forEach((button) => {
        button.addEventListener("click", function () {
          const appointmentID = this.getAttribute("data-id");
          console.log(
            "Join meeting button clicked for appointmentID:",
            appointmentID
          );
          showLoading();
          fetch(`${baseUrl}/api/appointment/${appointmentID}`)
            .then((response) => response.json())
            .then((appointmentData) => {
              hideLoading();
              if (appointmentData.PatientURL) {
                console.log(
                  "PatientURL found, joining meeting:",
                  appointmentData.PatientURL
                );
                localStorage.setItem("patientURL", appointmentData.PatientURL);
                window.location.href = "patientVisitAppointment.html";
              } else {
                console.error("Failed to join meeting. URL not found.");
                showNotification(
                  "Failed to join meeting. URL not found.",
                  "error"
                );
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              hideLoading();
              showNotification(
                "Failed to join meeting. Please try again.",
                "error"
              );
            });
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching appointments:", error);
    });

  // Function to show notification
  function showNotification(message, type) {
    hideLoading(); // Ensure loading is hidden before showing notification
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);
    console.log("Notification shown:", message, type);
    setTimeout(() => {
      notification.remove();
      console.log("Notification removed");
    }, 3000);
  }

  // Function to show loading interface
  function showLoading() {
    const loading = document.createElement("div");
    loading.className = "loading";
    loading.innerHTML = `<div class="loading-spinner"></div>`;
    document.body.appendChild(loading);
    console.log("Loading spinner shown");
  }

  // Function to hide loading interface
  function hideLoading() {
    const loading = document.querySelector(".loading");
    if (loading) {
      loading.remove();
      console.log("Loading spinner hidden");
    }
  }
});
