// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising dbConfig file
const medicineController = require("./controllers/medicineController");

// ========== Middleware ==========
// Initializing authMiddleware
const authorizeUser = require("../../middlewares/authMiddleware");

// ========== Set-up ==========
// Initialising medicineRoutes
const medicineRoutes = express.Router();

// ========== Routes ==========
// Define routes for the medicine
medicineRoutes.get("/", authorizeUser, medicineController.getAllMedicines);
medicineRoutes.post("/", authorizeUser, medicineController.createMedicine); // POST for creating medicines (can handle JSON data)
medicineRoutes.get("/:id", authorizeUser, medicineController.getMedicineById);
medicineRoutes.put("/:id", authorizeUser, medicineController.updateMedicine); // PUT for updating medicines
medicineRoutes.delete("/:id", authorizeUser, medicineController.deleteMedicine); // DELETE for deleting medicines
medicineRoutes.get(
  "/patient/:patientId",
  authorizeUser,
  medicineController.getMedicinesByPatientId
); // GET medicine by patient id
medicineRoutes.put(
  "/patient/:patientId",
  authorizeUser,
  medicineController.updatePatientMedicine
); // GET medicine by patient id

// ========== Export ==========
module.exports = medicineRoutes;
