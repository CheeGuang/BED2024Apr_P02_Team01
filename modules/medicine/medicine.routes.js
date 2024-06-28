// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising dbConfig file
const medicineController = require("./controllers/medicineController");

// ========== Set-up ==========
// Initialising medicineRoutes
const medicineRoutes = express.Router();

// ========== Routes ==========
// Define routes for the medicine
medicineRoutes.get("/", medicineController.getAllMedicines);
medicineRoutes.post("/", medicineController.createMedicine); // POST for creating medicines (can handle JSON data)
medicineRoutes.get("/:id", medicineController.getMedicineById);
medicineRoutes.put("/:id", medicineController.updateMedicine); // PUT for updating medicines
medicineRoutes.delete("/:id", medicineController.deleteMedicine); // DELETE for deleting medicines
medicineRoutes.get(
  "/patient/:patientId",
  medicineController.getMedicinesByPatientId
); // GET medicine by patient id
medicineRoutes.put(
  "/patient/:patientId",
  medicineController.updatePatientMedicine
); // GET medicine by patient id

// ========== Export ==========
module.exports = medicineRoutes;
