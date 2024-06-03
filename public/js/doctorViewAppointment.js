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
  function createAppointmentCard(appointment, type, startDateTime) {
    let cardClass = "";
    if (type === "today") {
      cardClass = "card-today";
    } else if (type === "upcoming") {
      cardClass = "card-upcoming";
    } else if (type === "history") {
      cardClass = "card-history";
    }

    return `
            <div class="card card-custom card-equal-height ${cardClass}">
                <div class="card-body">
                    <div class="icon-container">
                        <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                        <strong>${formatDate(appointment.endDateTime)}</strong>
                    </div>
                    <span class="date-time">Time: ${formatTime(
                      startDateTime
                    )}</span>
                    <span class="card-text">Description: ${truncateText(
                      appointment.IllnessDescription,
                      14
                    )}</span>
                    <div class="btn-container">
                        <button class="btn btn-dark btn-custom">Cancel</button>
                        <button class="btn btn-dark btn-custom">Check In</button>
                    </div>
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
        const endDateTime = new Date(appointment.endDateTime);
        const startDateTime = new Date(endDateTime);
        startDateTime.setHours(endDateTime.getHours() - 1);

        if (endDateTime < now) {
          if (endDateTime.toDateString() === now.toDateString()) {
            todayAppointmentsContainer.innerHTML += createAppointmentCard(
              appointment,
              "today",
              startDateTime
            );
          } else {
            historyAppointmentsContainer.innerHTML += createAppointmentCard(
              appointment,
              "history",
              startDateTime
            );
          }
        } else {
          upcomingAppointmentsContainer.innerHTML += createAppointmentCard(
            appointment,
            "upcoming",
            startDateTime
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
    })
    .catch((error) => console.error("Error fetching appointments:", error));
});
