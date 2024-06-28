// ========== Packages ==========
// Initializing express
const express = require("express");

// ========== Controllers ==========
// Initializing patientController
const patientController = require("./controllers/patientController");

// ========== Set-up ==========
// Initializing patientRoutes
const patientRoutes = express.Router();

// ========== Routes ==========

// Search patients
patientRoutes.get("/search", patientController.searchPatients);

// Create a new patient
patientRoutes.post("/", patientController.createPatient);

// Google login for patients
patientRoutes.post("/googleLogin", patientController.googleLogin);

// Get guest patient
patientRoutes.get("/guest", patientController.getGuestPatient);

// Top up e-wallet amount for a patient by ID
patientRoutes.put("/topup/:id", patientController.updateEWalletAmount);

// Get a specific patient by ID
patientRoutes.get("/:id", patientController.getPatientById);

// Update a specific patient by ID
patientRoutes.put("/:id", patientController.updatePatient);

// Delete a specific patient by ID
patientRoutes.delete("/:id", patientController.deletePatient);

// Get e-wallet amount for a specific patient by ID
patientRoutes.get("/:id/eWalletAmount", patientController.getEWalletAmount);

// Update the cart for a specific patient by ID
patientRoutes.put("/:patientId/cart", patientController.updatePatientCart);

// Clear the cart for a specific patient by ID
patientRoutes.put("/:patientId/clear-cart", patientController.clearCart);

// Process medicine payment for a specific patient by ID
patientRoutes.post("/:id/processPayment", patientController.processMedicinePayment);

// ========== Export ==========
// Export the patient routes to be used in other parts of the application
module.exports = patientRoutes;
