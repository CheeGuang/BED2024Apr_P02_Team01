async function loadBalance() {
  let currentBalanceElement = document.getElementById("current-balance");
  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;

  if (!patientId) {
    alert("Patient ID not found");
    return;
  }

  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/${patientId}/eWalletAmount`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(`E-wallet amount retrieved: ${data.eWalletAmount}`);
      currentBalanceElement.textContent =
        "S$" + parseFloat(data.eWalletAmount).toFixed(2);

      // Update local storage balance
      localStorage.setItem(
        "eWalletBalance",
        parseFloat(data.eWalletAmount).toFixed(2)
      );
    } else {
      const errorData = await response.json();
      console.error("Failed to load e-wallet amount:", errorData);
      alert("Failed to load e-wallet amount.");
    }
  } catch (error) {
    console.error("Error loading e-wallet amount:", error);
    alert("An error occurred while loading e-wallet amount.");
  }
}

// Load the balance when the page loads
window.onload = loadBalance;

async function confirmTopUp() {
  const topUpAmount = parseFloat(document.getElementById("topup-amount").value);
  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID; // Fetch patient ID from local storage

  if (isNaN(topUpAmount) || topUpAmount <= 0) {
    showNotification("Please enter a valid top-up amount", "error");
    return;
  }

  const uniqueLink = `${window.location.origin}/patienteWalletTopUp.html?patientId=${patientId}&amount=${topUpAmount}`;

  const qrCodeContainer = document.getElementById("qr-code-container");
  qrCodeContainer.innerHTML = ""; // Clear any existing QR code
  new QRCode(qrCodeContainer, {
    text: uniqueLink,
    width: 128,
    height: 128,
  });

  showNotification("Scan the QR code to complete the top-up", "success");
}

async function updateBalanceFromQR() {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("patientId");
  const topUpAmount = parseFloat(urlParams.get("amount"));

  if (patientId && !isNaN(topUpAmount)) {
    try {
      const response = await fetch(
        `${window.location.origin}/api/patient/topup/${patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: topUpAmount }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        document.getElementById(
          "current-balance"
        ).innerText = `S$${result.eWalletAmount.toFixed(2)}`;
        showNotification("Top-up successful", "success");
      } else {
        showNotification(`Failed to top-up: ${result.message}`, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("An error occurred while topping up", "error");
    }
  }
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.className = `notification ${type} show`;
  notification.innerText = message;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000); // Show the notification for 3 seconds
}

document.addEventListener("DOMContentLoaded", updateBalanceFromQR);
