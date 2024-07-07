// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising dbConfig file
const doctorController = require("../doctor/controllers/doctorController");

// ========== Middleware ==========
// Initializing authMiddleware
const authorizeUser = require("../../middlewares/authMiddleware");

// ========== Set-up ==========
// Initialising doctorRoutes
const doctorRoutes = express.Router();

// ========== Routes ==========
// Define routes for the doctor
doctorRoutes.get("/", doctorController.getAllDoctors);
doctorRoutes.post("/", doctorController.createDoctor); // POST for creating doctors (can handle JSON data)
doctorRoutes.post("/googleLogin", doctorController.googleLogin);
doctorRoutes.get("/guest", doctorController.getGuestDoctor);
doctorRoutes.get("/:id", authorizeUser, doctorController.getDoctorById);
doctorRoutes.put("/:id", authorizeUser, doctorController.updateDoctor); // PUT for updating doctors
doctorRoutes.delete("/:id", authorizeUser, doctorController.deleteDoctor); // DELETE for deleting doctors
// ========== Export ==========
module.exports = doctorRoutes;
