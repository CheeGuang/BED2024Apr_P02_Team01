// Function to create a medicine card HTML element
function createMedicineCard(medicine) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card product-card h-100">
        <div class="card-body text-center">
          <h5 class="card-title">${medicine.Name}</h5>
          <p class="card-text">${medicine.Description}</p>
          <p class="price">$${medicine.Price}/Box (30 Pills)</p>
          <p class="dosage">Recommended Dosage: ${
            medicine.RecommendedDosage
          }</p>
          <p class="shipping">
            <i class="fas fa-truck shipping-icon"></i> Free shipping
          </p>
          <button type="button" class="btn btn-dark-blue add-to-cart-btn" data-product="${medicine.Name.toLowerCase().replace(
            / /g,
            ""
          )}" data-price="${
    medicine.Price
  }" onclick="addToCart(event)">Add To Cart</button>
        </div>
      </div>
    </div>`;
}

function addToCart(event) {
  const addToCartButton = event.target;
  const medicineName = addToCartButton.dataset.product;
  const medicinePrice = parseFloat(addToCartButton.dataset.price);
  const quantity = 1; // Assuming quantity is always 1 when adding

  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;

  if (!patientId) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  // Fetch patient's current cart to check for existing items
  fetch(`${window.location.origin}/api/patient/${patientId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }
      return response.json();
    })
    .then((patientData) => {
      let cart = patientData.Cart || {};

      // Check if the item already exists in the cart
      if (cart[medicineName]) {
        // Item exists, update the quantity
        cart[medicineName].Quantity += quantity;
      } else {
        // Item does not exist, add it to the cart
        cart[medicineName] = {
          Quantity: quantity,
          Price: medicinePrice,
        };
      }

      // Send updated cart data to the backend
      return fetch(`${window.location.origin}/api/patient/${patientId}/cart`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Cart updated successfully:", data);
      // Update UI or handle success as needed
    })
    .catch((error) => {
      console.error("Error updating cart:", error.message);
      // Handle errors appropriately
    });

  const cartPopup = document.getElementById("cart-popup");
  cartPopup.classList.remove("hidden");

  setTimeout(() => {
    cartPopup.classList.add("hidden");
  }, 2000); // Hide popup after 2 seconds
}

// Fetch the medicines from the backend and display them
async function fetchMedicines() {
  const patientId = JSON.parse(
    localStorage.getItem("patientDetails")
  ).PatientID;

  if (!patientId) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(
      `${window.location.origin}/api/medicine/patient/${patientId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWTAuthToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const medicines = await response.json();
    const medicineCardsContainer = document.getElementById("medicine-cards");

    medicines.forEach((medicine) => {
      const medicineCardHTML = createMedicineCard(medicine);
      medicineCardsContainer.innerHTML += medicineCardHTML;
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
  }
}

// Call the fetchMedicines function when the page loads
window.onload = fetchMedicines;
