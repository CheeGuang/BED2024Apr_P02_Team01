const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const gstAmountElement = document.getElementById("gst-amount");
const clearCartButton = document.getElementById("clear-cart-button");

// Function to display a cart item
function displayCartItem(name, quantity, price) {
  const listItem = document.createElement("li");
  listItem.className =
    "list-group-item d-flex justify-content-between align-items-center";
  listItem.innerHTML = `${name} (x${quantity}) <span>$${price.toFixed(
    2
  )}</span>`;
  cartItemsList.appendChild(listItem);
}

// Function to calculate and display total price
function calculateTotalPrice(cart) {
  let total = 0;
  for (const item in cart) {
    total += cart[item].Price * cart[item].Quantity;
  }
  const gstAmount = total * 0.09;
  const finalTotal = total + gstAmount;

  gstAmountElement.textContent = `$${gstAmount.toFixed(2)}`;
  totalPriceElement.textContent = `$${finalTotal.toFixed(2)}`;
}

// Function to fetch and display cart items from the database
async function fetchCartItems() {
  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;

  if (!patientId) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/${patientId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch patient data");
    }
    const patientData = await response.json();
    const cart = patientData.Cart || {};

    if (cart && Object.keys(cart).length > 0) {
      for (const item in cart) {
        displayCartItem(item, cart[item].Quantity, cart[item].Price);
      }
      calculateTotalPrice(cart);
    } else {
      displayEmptyCartMessage();
    }
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
  }
}

function displayEmptyCartMessage() {
  const emptyCartMessage = document.createElement("li");
  emptyCartMessage.className =
    "list-group-item d-flex justify-content-between align-items-center";
  emptyCartMessage.innerHTML = "No Items In Cart <span></span>";
  cartItemsList.appendChild(emptyCartMessage);
  totalPriceElement.textContent = "$0.00";
  gstAmountElement.textContent = "$0.00";
}

async function clearCart() {
  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;

  if (!patientId) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/${patientId}/clear-cart`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }

    // Clear the frontend cart display
    cartItemsList.innerHTML = "";
    displayEmptyCartMessage();
  } catch (error) {
    console.error("Error clearing cart:", error.message);
  }
}

// Add click event listener to clear cart button
clearCartButton.addEventListener("click", clearCart);

// Fetch and display cart items when the page loads
window.onload = () => {
  fetchCartItems();
  loadBalance();
};

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.innerText = message;

  notification.className = `notification ${type}`;
  notification.classList.add("show");

  setTimeout(() => {
    notification.className = "notification";
    notification.classList.remove("show");
  }, 3000); // Show the notification for 3 seconds
}

// Function to clear the cart after successful payment
async function clearCartAfterPayment() {
  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;

  if (!patientId) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/${patientId}/clear-cart`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to clear cart after payment");
    }

    // Clear the frontend cart display
    clearCartUI();
  } catch (error) {
    console.error("Error clearing cart after payment:", error.message);
  }
}

function clearCartUI() {
  cartItemsList.innerHTML = "";
  displayEmptyCartMessage();
}

// Event listener for Pay Using E-Wallet button
document
  .getElementById("pay-ewallet-button")
  .addEventListener("click", async () => {
    const cartItems = document.getElementById("cart-items").children;

    if (
      cartItems.length === 0 ||
      (cartItems.length === 1 &&
        cartItems[0].innerText.includes("No Items In Cart"))
    ) {
      showNotification("Cart is Empty", "error");
      return;
    }

    const totalAmount = parseFloat(
      document.getElementById("total-price").textContent.replace("$", "")
    );
    const currentBalance = parseFloat(
      document.getElementById("current-balance").textContent.replace("S$", "")
    );
    const patientId = JSON.parse(
      localStorage.getItem("patientDetails")
    ).PatientID;

    if (totalAmount > currentBalance) {
      showNotification("Insufficient balance in E-Wallet", "error");
      return;
    }

    try {
      const response = await fetch(
        `${window.location.origin}/api/patient/${patientId}/processPayment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totalAmount }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        showNotification(result.message, "success");
        document.getElementById(
          "current-balance"
        ).textContent = `S$${parseFloat(result.eWalletAmount).toFixed(2)}`;
        await clearCartAfterPayment(); // Clear the cart after payment success
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      showNotification("Error processing payment", "error");
    }
  });

async function loadBalance() {
  const currentBalanceElement = document.getElementById("current-balance");
  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;

  if (!patientId) {
    alert("Patient ID not found");
    return;
  }

  try {
    const response = await fetch(
      `${window.location.origin}/api/patient/${patientId}/eWalletAmount`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
          "Content-Type": "application/json",
        },
      }
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
