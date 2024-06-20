document.addEventListener("DOMContentLoaded", function () {
  // Get PatientID from local storage
  const PatientID = localStorage.getItem("PatientID");
  console.log("Retrieved PatientID from localStorage:", PatientID);

  // Get references to the DOM elements
  const appointmentRadio = document.getElementById("appointment");
  const nowRadio = document.getElementById("now");
  const scheduleContainer = document.querySelector(".appointment-schedule");
  const appointmentDateInput = document.getElementById("appointment-date");
  const appointmentTimeInput = document.getElementById("appointment-time");

  // Dynamically get the current website's domain
  const baseUrl = window.location.origin;

  // Event listener for the "Schedule an Appointment" radio button
  appointmentRadio.addEventListener("change", function () {
    if (appointmentRadio.checked) {
      // Show the schedule container and make date and time inputs required
      scheduleContainer.style.display = "block";
      appointmentDateInput.setAttribute("required", "required");
      appointmentTimeInput.setAttribute("required", "required");
      setMinMaxDateTime(); // Set minimum and maximum date and time for inputs
    }
  });

  // Event listener for the "Visit Doctor Now" radio button
  nowRadio.addEventListener("change", function () {
    if (nowRadio.checked) {
      // Hide the schedule container and remove the required attribute from date and time inputs
      scheduleContainer.style.display = "none";
      appointmentDateInput.removeAttribute("required");
      appointmentTimeInput.removeAttribute("required");
    }
  });

  // Event listener for form submission
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Show the loading interface
    showLoading();

    // Get values from the form inputs
    const selectedOption = document.querySelector(
      'input[name="appointmentOption"]:checked'
    ).value;
    const appointmentDate = appointmentDateInput.value;
    const appointmentTime = appointmentTimeInput.value;
    const illnessDescription = document.getElementById(
      "illness-description"
    ).value;

    let endDate;

    if (selectedOption === "appointment") {
      // Calculate the end date and time for the appointment
      endDate = new Date(`${appointmentDate}T${appointmentTime}:00`);
      endDate.setHours(endDate.getHours() + 1); // Add 1 hour to the end date
    } else {
      // If "Visit Doctor Now" is selected, set the end date to one hour from now
      endDate = new Date();
      endDate.setHours(endDate.getHours() + 1);
    }

    // Convert end date to Singapore Time (SGT)
    const sgtOffset = 8 * 60 * 60 * 1000;
    const sgtDate = new Date(endDate.getTime() + sgtOffset);
    const formattedEndDate = sgtDate.toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:MM"

    // Make the POST request to the API
    fetch(`${baseUrl}/api/appointment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: formattedEndDate,
        illnessDescription: illnessDescription,
        PatientID: PatientID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        hideLoading();
        showNotification("Appointment successfully booked!", "success");
        setTimeout(() => {
          window.location.href = "patientViewAppointment.html";
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
        hideLoading();
        showNotification(
          "Failed to book appointment. Please try again.",
          "error"
        );
      });
  });

  // Function to show notification
  function showNotification(message, type) {
    hideLoading(); // Ensure loading is hidden before showing notification
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Function to show loading interface
  function showLoading() {
    const loading = document.createElement("div");
    loading.className = "loading";
    loading.innerHTML = `<div class="loading-spinner"></div>`;
    document.body.appendChild(loading);
  }

  // Function to hide loading interface
  function hideLoading() {
    const loading = document.querySelector(".loading");
    if (loading) {
      loading.remove();
    }
  }

  // Function to set the minimum and maximum date and time for the date and time inputs
  function setMinMaxDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15); // Set the minutes 15 minutes ahead
    const minDate = now.toISOString().split("T")[0];
    const minTime = now.toTimeString().split(" ")[0].substring(0, 5);

    appointmentDateInput.setAttribute("min", minDate);

    // Set maximum date to 7 days from now
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    maxDate = maxDate.toISOString().split("T")[0];

    appointmentDateInput.setAttribute("max", maxDate);

    const dateInput = appointmentDateInput;
    const timeInput = appointmentTimeInput;

    // Event listener for date input changes
    dateInput.addEventListener("input", function () {
      if (dateInput.value === minDate) {
        timeInput.setAttribute("min", minTime);
      } else {
        timeInput.removeAttribute("min");
      }
    });

    // Check the current value of the date input on page load
    if (dateInput.value === minDate) {
      timeInput.setAttribute("min", minTime);
    } else {
      timeInput.removeAttribute("min");
    }
  }

  setMinMaxDateTime();
  setInterval(setMinMaxDateTime, 60000); // Update the minimum time every minute
});
