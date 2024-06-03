document.addEventListener("DOMContentLoaded", function () {
  // Set Local Storage DoctorID as 1
  localStorage.setItem("DoctorID", 1);

  // Get Local Storage DoctorID
  const doctorID = localStorage.getItem("DoctorID");

  // Function to format date
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Function to format time
  function formatTime(dateString) {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  }

  // Function to truncate text
  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  // Function to create appointment card
  function createAppointmentCard(appointment, category) {
    let cardClass = "";
    let buttonsHTML = "";
    if (category === "today") {
      cardClass = "card-today";
      buttonsHTML = `
            <div class="btn-container">
              <button class="btn btn-dark btn-custom cancel-btn">Cancel</button>
              <button class="btn btn-dark btn-custom join-meeting-btn" data-appointment-id="${appointment.AppointmentID}">Join Meeting</button>
            </div>
          `;
    } else if (category === "upcoming") {
      cardClass = "card-upcoming";
      buttonsHTML = `
            <div class="btn-container">
              <button class="btn btn-dark btn-custom cancel-btn">Cancel</button>
            </div>
          `;
    } else if (category === "history") {
      cardClass = "card-history";
      buttonsHTML = `
            <div class="btn-container">
              <button class="btn btn-dark btn-custom download-mc-btn">
                <i class="fas fa-download"></i> Download MC
              </button>
            </div>
          `;
    }

    return `
          <div class="card card-custom card-equal-height ${cardClass}" data-appointment-id="${appointment.AppointmentID}">
            <div class="card-body">
              <div class="icon-container">
                <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                <strong>${formatDate(appointment.endDateTime)}</strong>
              </div>
              <span class="date-time">Time: ${formatTime(
                appointment.StartDateTime
              )}</span>
              <span class="card-text">Description: ${truncateText(
                appointment.IllnessDescription,
                14
              )}</span>
              ${buttonsHTML}
            </div>
          </div>
        `;
  }

  // Fetch appointments by DoctorID
  fetch(`http://localhost:8000/api/appointment/getByDoctorID/${doctorID}`)
    .then((response) => response.json())
    .then((data) => {
      const todayAppointmentsContainer =
        document.getElementById("today-appointments");
      const upcomingAppointmentsContainer = document.getElementById(
        "upcoming-appointments"
      );
      const historyAppointmentsContainer = document.getElementById(
        "history-appointments"
      );

      todayAppointmentsContainer.innerHTML = "";
      upcomingAppointmentsContainer.innerHTML = "";
      historyAppointmentsContainer.innerHTML = "";

      const now = new Date();

      data.forEach((appointment) => {
        // Calculate StartDateTime as EndDateTime - 1hr
        const endDateTime = new Date(appointment.endDateTime);
        const startDateTime = new Date(endDateTime.getTime() - 60 * 60 * 1000);
        appointment.StartDateTime = startDateTime;

        if (startDateTime < now && endDateTime < now) {
          historyAppointmentsContainer.innerHTML += createAppointmentCard(
            appointment,
            "history"
          );
        } else if (startDateTime.toDateString() === now.toDateString()) {
          todayAppointmentsContainer.innerHTML += createAppointmentCard(
            appointment,
            "today"
          );
        } else {
          upcomingAppointmentsContainer.innerHTML += createAppointmentCard(
            appointment,
            "upcoming"
          );
        }
      });

      if (!todayAppointmentsContainer.innerHTML) {
        todayAppointmentsContainer.innerHTML = "<span>No Appointments</span>";
      }

      if (!upcomingAppointmentsContainer.innerHTML) {
        upcomingAppointmentsContainer.innerHTML =
          "<span>No Appointments</span>";
      }

      if (!historyAppointmentsContainer.innerHTML) {
        historyAppointmentsContainer.innerHTML = "<span>No Appointments</span>";
      }

      document.querySelectorAll(".join-meeting-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const appointmentID = this.getAttribute("data-appointment-id");
          fetch(`http://localhost:8000/api/appointment/${appointmentID}`)
            .then((response) => response.json())
            .then((appointment) => {
              window.location.href = `doctorVisitAppointment.html?hostRoomURL=${encodeURIComponent(
                appointment.HostRoomURL
              )}`;
            })
            .catch((error) =>
              console.error("Error fetching appointment details:", error)
            );
        });
      });
    })
    .catch((error) => console.error("Error fetching appointments:", error));
});
