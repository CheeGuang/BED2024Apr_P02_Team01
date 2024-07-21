document.addEventListener("DOMContentLoaded", function () {
  const analysisResult = localStorage.getItem("analysisResult");
  const errorMessageElement = document.getElementById("error-message");
  const medicineInfoBody = document.getElementById("medicine-info-body");

  if (analysisResult) {
    if (
      analysisResult.includes(
        "Image uploaded does not seem to contain a medicine package or label. Please try again"
      )
    ) {
      errorMessageElement.textContent =
        "The uploaded image does not seem to contain a medicine package or label. Please try again.";
      errorMessageElement.style.display = "block";
    } else {
      // Split the result by line breaks
      const lines = analysisResult.split("\n");

      // Initialize an object to store the parsed information
      const medicineInfo = {
        "Medicine Name": "",
        "Main Purpose": "",
        "Side Effects": "",
        "Recommended Dosage": "",
        "Other Remarks": "",
      };

      // Parse each line and map it to the respective field
      lines.forEach((line) => {
        const [key, ...valueParts] = line.split(":");
        const value = valueParts.join(":").trim();
        if (medicineInfo.hasOwnProperty(key)) {
          medicineInfo[key] = value;
        }
      });

      // Create a new table row and populate it with the parsed information
      const row = document.createElement("tr");
      Object.values(medicineInfo).forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      medicineInfoBody.appendChild(row);
    }
    localStorage.removeItem("analysisResult"); // Clear analysisResult after processing
  }

  // Fetch and display the history data
  const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
  const patientID = patientDetails.PatientID;

  fetch(`/api/chatbot/recognition-history/${patientID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("PatientJWTAuthToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Success") {
        const history = data.history;
        const historyBody = document.getElementById("history-body");

        if (history.length === 0) {
          const noHistoryMessage = document.createElement("tr");
          noHistoryMessage.innerHTML =
            '<td colspan="6" class="text-center">No history available.</td>';
          historyBody.appendChild(noHistoryMessage);
        } else {
          history.forEach((entry) => {
            const row = document.createElement("tr");
            Object.values(entry).forEach((value) => {
              const cell = document.createElement("td");
              cell.textContent = value;
              row.appendChild(cell);
            });
            historyBody.appendChild(row);
          });
        }
      } else {
        errorMessageElement.textContent = "Failed to load history.";
        errorMessageElement.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      errorMessageElement.textContent =
        "An error occurred while fetching history.";
      errorMessageElement.style.display = "block";
    });
});
