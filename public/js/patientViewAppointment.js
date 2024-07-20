document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event triggered");

  // Get PatientID from local storage
  const PatientID = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;
  console.log("Retrieved PatientID from localStorage:", PatientID);

  // Dynamically get the current website's domain
  const baseUrl = window.location.origin;
  console.log("Base URL:", baseUrl);

  // Fetch all patient appointments that match PatientID
  fetch(`${baseUrl}/api/appointment/getByPatientID/${PatientID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("PatientJWTAuthToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched appointment data:", data);

      // Sort appointments from earliest to latest
      data.sort((a, b) => new Date(a.endDateTime) - new Date(b.endDateTime));
      console.log("Sorted appointment data:", data);

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

      // Get the current date and time in Singapore time
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" })
      );
      console.log("Current date and time (SGT):", now);

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
                category === "today" && appointment.DoctorID
                  ? '<button class="btn btn-dark btn-custom join-meeting-button" data-id="' +
                    appointment.AppointmentID +
                    '">Join Meeting</button>'
                  : category === "today"
                  ? '<button class="btn btn-dark btn-custom join-meeting-button" data-id="' +
                    appointment.AppointmentID +
                    '" disabled>Awaiting Doctor</button>'
                  : ""
              }
              ${
                category === "history"
                  ? '<button class="btn btn-dark btn-custom btn-download" data-id="' +
                    appointment.AppointmentID +
                    '"><i class="fas fa-download"></i> Download MC</button>' +
                    '<button class="btn btn-dark btn-custom btn-email-mc" data-id="' +
                    appointment.AppointmentID +
                    '"><i class="fa-solid fa-envelope"></i> Email MC</button>'
                  : ""
              }
            </div>
          </div>
        `;

        if (category === "upcoming") {
          card.querySelector(".cancel-button").style.width = "100%";
        }

        return card;
      };

      // Categorize appointments
      data.forEach((appointment) => {
        // Calculate StartDateTime as endDateTime - 1hr in Singapore time
        const endDateTime = new Date(
          new Date(appointment.endDateTime).toLocaleString("en-US", {
            timeZone: "Asia/Singapore",
          })
        );
        const startDateTime = new Date(endDateTime.getTime() - 60 * 60 * 1000);
        appointment.StartDateTime = startDateTime;
        console.log("Calculated StartDateTime (SGT):", startDateTime);

        if (appointment.diagnosis || endDateTime < now) {
          console.log("Appointment categorized as history");
          historyContainer.appendChild(createCard(appointment, "history"));
        } else if (
          startDateTime.getFullYear() > now.getFullYear() ||
          (startDateTime.getFullYear() === now.getFullYear() &&
            startDateTime.getMonth() > now.getMonth()) ||
          (startDateTime.getFullYear() === now.getFullYear() &&
            startDateTime.getMonth() === now.getMonth() &&
            startDateTime.getDate() > now.getDate())
        ) {
          console.log("Appointment categorized as upcoming");
          upcomingContainer.appendChild(createCard(appointment, "upcoming"));
        } else {
          console.log("Appointment categorized as today");
          todayContainer.appendChild(createCard(appointment, "today"));
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
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "PatientJWTAuthToken"
              )}`,
              "Content-Type": "application/json",
            },
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
          fetch(`${baseUrl}/api/appointment/${appointmentID}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "PatientJWTAuthToken"
              )}`,
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((appointmentData) => {
              hideLoading();
              if (appointmentData.PatientURL) {
                console.log(
                  "PatientURL found, joining meeting:",
                  appointmentData.PatientURL
                );
                const urlParams = new URLSearchParams({
                  patientURL: encodeURIComponent(appointmentData.PatientURL),
                  appointmentID: appointmentID,
                });
                window.location.href = `patientVisitAppointment.html?${urlParams.toString()}`;
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

      // Add event listeners for Download MC buttons
      document.querySelectorAll(".btn-download").forEach((button) => {
        button.addEventListener("click", function () {
          const appointmentID = this.getAttribute("data-id");
          console.log(
            "Download MC button clicked for appointmentID:",
            appointmentID
          );
          const mcUrl = `${baseUrl}/api/appointment/${appointmentID}/medicalCertificate`;

          fetch(mcUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "PatientJWTAuthToken"
              )}`,
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
      });

      // Email Feature
      // Add event listeners for Email MC Button
      document.querySelectorAll(".btn-email-mc").forEach((button) => {
        // Start
        // Start
        button.addEventListener("click", function () {
          // Button Listener Start
          // Button Listener Start
          const appointmentID = this.getAttribute("data-id");
          console.log(
            "Email MC button clicked for appointmentID:",
            appointmentID
          );
          const mcUrl = `${baseUrl}/api/appointment/${appointmentID}/emailMedicalCertificate`;

          fetch(mcUrl, {
            //Fetch Start
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "PatientJWTAuthToken"
              )}`,
              "Content-Type": "application/json",
            },
          }) // Fetch End
            .then((response) => {
              // Response Start
              if (!response.ok) {
                throw new Error("Network response was not ok");
              } else {
                console.log("MC Email sent successfully!");
                showNotification("MC successfully sent!", "success");
              }
              //return response.blob();
            }) // Response End
            // .then((blob) => {
            //   const url = window.URL.createObjectURL(blob);
            //   const a = document.createElement("a");
            //   a.style.display = "none";
            //   a.href = url;
            //   a.download = "SyncHealth-MedicalCertificate.pdf"; // you can specify a custom file name here
            //   document.body.appendChild(a);
            //   a.click();
            //   window.URL.revokeObjectURL(url);
            // })
            .catch((error) => {
              // Catch Start
              console.error("Error downloading medical certificate:", error);
            }); // Catch End
        }); // Button Listener End
      }); // End of Start
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

  // Set up MutationObserver to listen for changes in the join meeting button
  const observeJoinMeetingButtonChanges = () => {
    const buttons = document.querySelectorAll(".join-meeting-button");
    buttons.forEach((button) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "disabled"
          ) {
            if (button.disabled) {
              button.innerText = "Awaiting Doctor";
            } else {
              button.innerText = "Join Meeting Room";
            }
          }
        });
      });

      observer.observe(button, {
        attributes: true,
      });
    });
  };

  observeJoinMeetingButtonChanges();
});
