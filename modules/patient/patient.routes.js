// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising dbConfig file
const patientController = require("./controllers/patientController");

// ========== Set-up ==========
// Initialising patientRoutes
const patientRoutes = express.Router();

// ========== Routes ==========
// Define routes for the Patient
patientRoutes.get("/", patientController.getAllPatients);
patientRoutes.post("/", patientController.createPatient); // POST for creating patients (can handle JSON data)
patientRoutes.get("/search", patientController.searchPatients);
patientRoutes.get("/:id", patientController.getPatientById);
patientRoutes.put("/:id", patientController.updatePatient); // PUT for updating patients
patientRoutes.delete("/:id", patientController.deletePatient); // DELETE for deleting patients
patientRoutes.put("/:patientId/cart", patientController.updatePatientCart);
patientRoutes.put("/:patientId/clear-cart", patientController.clearCart);

// ========== Export ==========
module.exports = patientRoutes;
