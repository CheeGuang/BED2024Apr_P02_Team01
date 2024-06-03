document.addEventListener("DOMContentLoaded", function () {
  // Fetch unassigned appointments
  fetch("http://localhost:8000/api/appointment/unassigned/")
    .then((response) => response.json())
    .then((data) => {
      const appointmentContainer = document.getElementById(
        "appointment-container"
      );
      appointmentContainer.innerHTML = "";

      if (data.length === 0) {
        appointmentContainer.innerHTML = "<p>No Appointments</p>";
      } else {
        data.forEach((appointment) => {
          const endDateTime = new Date(appointment.endDateTime);
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
              <div class="col-lg-6 col-md-6 col-sm-12 mb-3">
                <div class="card card-custom card-history card-equal-height">
                  <div class="card-body">
                    <div class="icon-container">
                      <i class="fas fa-calendar-alt"></i>
                      <strong>${formattedDate}</strong>
                    </div>
                    <span class="date-time">Time: ${formattedStartTime}</span>
                    <span class="card-text">Patient: ${appointment.PatientID}</span>
                    <span class="card-text">Description: ${appointment.IllnessDescription}</span>
                    <a href="#" class="btn btn-dark btn-custom btn-take-up">Take Up</a>
                  </div>
                </div>
              </div>
            `;
          appointmentContainer.innerHTML += appointmentCard;
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
});
