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
patientRoutes.get("/search", patientController.searchPatients);
patientRoutes.post("/", patientController.createPatient); // Add route for creating a patient

patientRoutes.post("/googleLogin", patientController.googleLogin);

patientRoutes.get("/:id", patientController.getPatientById);
patientRoutes.put("/:id", patientController.updatePatient); // PUT for updating patients
patientRoutes.delete("/:id", patientController.deletePatient); // DELETE for deleting patients

// ========== Export ==========
module.exports = patientRoutes;
