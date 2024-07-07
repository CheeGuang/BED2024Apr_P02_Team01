document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const hostRoomURL = urlParams.get("hostRoomURL");
  if (hostRoomURL) {
    document.querySelector("iframe").src = hostRoomURL;
  }

  const appointmentId = urlParams.get("appointmentID");

  // Set MC Start Date to today in Singapore time
  const today = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Singapore",
  });
  const todayDate = new Date(today).toISOString().split("T")[0];
  const mcEndDateInput = document.getElementById("mcenddate");
  mcEndDateInput.setAttribute("min", todayDate);

  // Fetch all medicines from the medicine table
  fetch(`${window.location.origin}/api/medicine`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((medicines) => {
      const medicineCheckboxes = document.getElementById("medicine-checkboxes");
      medicines.forEach((medicine) => {
        const label = document.createElement("label");
        label.classList.add("form-check-label");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add("form-check-input");
        input.value = medicine.MedicineID;
        input.name = "medicines";

        label.appendChild(input);
        label.appendChild(
          document.createTextNode(
            `${medicine.Name} - ${medicine.Description} (Dosage: ${medicine.RecommendedDosage})`
          )
        );
        medicineCheckboxes.appendChild(label);
      });
    })
    .catch((error) => console.error("Error fetching medicines:", error));

  // Handle form submission
  document
    .getElementById("appointment-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const diagnosis = document.getElementById("diagnosis").value;
      const mcenddate = document.getElementById("mcenddate").value;
      const doctornotes = document.getElementById("doctornotes").value;
      const medicineCheckboxes = document.querySelectorAll(
        'input[name="medicines"]:checked'
      );
      const MedicineIDs = Array.from(medicineCheckboxes).map((checkbox) =>
        parseInt(checkbox.value)
      );

      // Convert mcenddate and todayDate to Singapore time and compare
      const mcEndDateSGT = new Date(
        new Date(mcenddate).toLocaleString("en-US", {
          timeZone: "Asia/Singapore",
        })
      ).setHours(0, 0, 0, 0);
      const todaySGT = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Singapore",
        })
      ).setHours(0, 0, 0, 0);

      // Ensure mcenddate is not before today
      if (mcEndDateSGT < todaySGT) {
        showNotification("MC End Date cannot be before today.", "error");
        return;
      }

      const requestBody = {
        Diagnosis: diagnosis,
        MCStartDate: todayDate, // Default to today in Singapore time
        MCEndDate: mcenddate,
        DoctorNotes: doctornotes,
        MedicineIDs: MedicineIDs,
      };

      console.log(appointmentId);
      fetch(
        `${window.location.origin}/api/appointment/${appointmentId}/updateWithMedicines`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "Success") {
            showNotification("Appointment updated successfully!", "success");
          } else {
            showNotification("Failed to update appointment.", "error");
          }
        })
        .catch((error) => {
          console.error("Error updating appointment:", error);
          showNotification("Failed to update appointment.", "error");
        });
    });

  // Function to show notification
  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 4000);
  }
});
