document.addEventListener("DOMContentLoaded", function () {
  // Dynamically get the current website's domain
  const baseUrl = window.location.origin;

  // Fetch unassigned appointments
  fetch(`${baseUrl}/api/appointment/unassigned/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const appointmentContainer = document.getElementById(
        "appointment-container"
      );
      appointmentContainer.innerHTML = "";

      const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Singapore",
      });
      const currentTime = new Date(now);

      const filteredAppointments = data.filter((appointment) => {
        const endDateTime = new Date(
          new Date(appointment.endDateTime).toLocaleString("en-US", {
            timeZone: "Asia/Singapore",
          })
        );
        const oneHourAfterEndDateTime = new Date(
          endDateTime.getTime() + 1 * 60 * 60 * 1000
        );
        return oneHourAfterEndDateTime > currentTime;
      });

      if (filteredAppointments.length === 0) {
        appointmentContainer.innerHTML = "<p>No Appointments</p>";
      } else {
        filteredAppointments.forEach((appointment) => {
          const endDateTime = new Date(
            new Date(appointment.endDateTime).toLocaleString("en-US", {
              timeZone: "Asia/Singapore",
            })
          );
          const startDateTime = new Date(
            endDateTime.getTime() - 60 * 60 * 1000
          ); // Subtract 1 hour

          const formattedDate = startDateTime.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });

          const formattedStartTime = startDateTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const appointmentCard = `
            <div class="col-lg-6 col-md-6 col-sm-12 mb-3" data-appointment-id="${appointment.AppointmentID}">
              <div class="card card-custom card-history card-equal-height">
                <div class="card-body">
                  <div class="icon-container">
                    <i class="fas fa-calendar-alt"></i>
                    <strong>${formattedDate}</strong>
                  </div>
                  <span class="date-time">Time: ${formattedStartTime}</span>
                  <span class="card-text">Description: ${appointment.IllnessDescription}</span>
                  <a href="#" class="btn btn-dark btn-custom btn-take-up">Take Up</a>
                </div>
              </div>
            </div>
          `;
          appointmentContainer.innerHTML += appointmentCard;
        });

        document.querySelectorAll(".btn-take-up").forEach((button) => {
          button.addEventListener("click", function (event) {
            event.preventDefault();
            const card = this.closest("[data-appointment-id]");
            const appointmentId = card.getAttribute("data-appointment-id");
            const doctorId = JSON.parse(
              localStorage.getItem("doctorDetails")
            ).DoctorID;

            showLoading();

            fetch(
              `${baseUrl}/api/appointment/${appointmentId}/updateDoctorId`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "JWTAuthToken"
                  )}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ DoctorID: doctorId }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                hideLoading();
                if (data && data.AppointmentID) {
                  showNotification("Doctor ID updated successfully", "success");
                  setTimeout(() => {
                    window.location.reload();
                  }, 2500);
                } else {
                  showNotification("Failed to update Doctor ID", "error");
                }
              })
              .catch((error) => {
                hideLoading();
                showNotification("Error updating Doctor ID", "error");
                console.error("Error:", error);
              });
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching unassigned appointments:", error);
      const appointmentContainer = document.getElementById(
        "appointment-container"
      );
      appointmentContainer.innerHTML = "<p>Error loading appointments.</p>";
    });

  function showLoading() {
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("loading");
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
    `;
    document.body.appendChild(loadingElement);
  }

  function hideLoading() {
    const loadingElement = document.querySelector(".loading");
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2500); // Display for 2.5 seconds
  }
});
