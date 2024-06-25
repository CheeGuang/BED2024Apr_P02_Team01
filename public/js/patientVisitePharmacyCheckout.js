const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const clearCartButton = document.getElementById("clear-cart-button");

// Function to display a cart item
function displayCartItem(name, quantity, price) {
  const listItem = document.createElement("li");
  listItem.textContent = `${name} (x${quantity}) - $${price.toFixed(2)}`;
  cartItemsList.appendChild(listItem);
}

// Function to calculate and display total price
function calculateTotalPrice(cart) {
  let total = 0;
  for (const item in cart) {
    total += cart[item].Price * cart[item].Quantity;
  }
  totalPriceElement.textContent = `Total Price: $${total.toFixed(2)}`;
}

// Function to fetch and display cart items from the database
async function fetchCartItems() {
  const patientIdString = localStorage.getItem("PatientID");
  if (!patientIdString) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  const patientId = parseInt(patientIdString);

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
      cartItemsList.textContent = "No items in your cart.";
      totalPriceElement.textContent = "";
    }
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
  }
}

async function clearCart() {
  const patientIdString = localStorage.getItem("PatientID");
  if (!patientIdString) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  const patientId = parseInt(patientIdString);

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
    cartItemsList.textContent = "No items in your cart.";
    totalPriceElement.textContent = "";
  } catch (error) {
    console.error("Error clearing cart:", error.message);
  }
}

// Add click event listener to clear cart button
clearCartButton.addEventListener("click", clearCart);

// Fetch and display cart items when the page loads
window.onload = fetchCartItems;
