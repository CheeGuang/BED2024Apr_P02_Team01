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
      `${window.location.origin}/api/patient/${patientId}`
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
      const emptyCartMessage = document.createElement("li");
      emptyCartMessage.className =
        "list-group-item d-flex justify-content-between align-items-center";
      emptyCartMessage.innerHTML = "No Items In Cart <span></span>";
      cartItemsList.appendChild(emptyCartMessage);
      totalPriceElement.textContent = "$0.00";
      gstAmountElement.textContent = "$0.00";
    }
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
  }
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
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }

    // Clear the frontend cart display
    cartItemsList.innerHTML = "";
    const emptyCartMessage = document.createElement("li");
    emptyCartMessage.className =
      "list-group-item d-flex justify-content-between align-items-center";
    emptyCartMessage.innerHTML = "No Items in Cart <span></span>";
    cartItemsList.appendChild(emptyCartMessage);
    totalPriceElement.textContent = "$0.00";
    gstAmountElement.textContent = "$0.00";
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
function clearCartUI() {
  document.getElementById("cart-items").innerHTML =
    '<li class="list-group-item d-flex justify-content-between align-items-center">No Items in Cart<span></span></li>';
  document.getElementById("gst-amount").textContent = "$0.00";
  document.getElementById("total-price").textContent = "$0.00";
}

// Event listener for Pay Using E-Wallet button
document
  .getElementById("pay-ewallet-button")
  .addEventListener("click", async () => {
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

    const cartItems = document.getElementById("cart-items").children;
    if (
      cartItems.length === 0 ||
      (cartItems.length === 1 &&
        cartItems[0].innerText.includes("No Items in Cart"))
    ) {
      showNotification("Cart is Empty", "error");
      return;
    }

    try {
      const response = await fetch(
        `${window.location.origin}/api/patient/${patientId}/processPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totalAmount }),
        }
      );

      const result = await response.json();
      if (result.status === "Success") {
        showNotification(result.message, "success");
        document.getElementById(
          "current-balance"
        ).textContent = `S$${result.eWalletAmount.toFixed(2)}`;
        clearCartUI(); // Clear the cart UI immediately after payment success
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      showNotification("Error processing payment", "error");
    }
  });

document
  .getElementById("back-button")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    history.back(); // Go back to the previous page
  });
