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
doctorRoutes.get("/", authorizeUser, doctorController.getAllDoctors);
doctorRoutes.post("/", doctorController.createDoctor); // POST for creating doctors (can handle JSON data)
doctorRoutes.post("/googleLogin", doctorController.googleLogin);
doctorRoutes.get("/guest", doctorController.getGuestDoctor);
doctorRoutes.get("/:id", doctorController.getDoctorById);
doctorRoutes.put("/:id", doctorController.updateDoctor); // PUT for updating doctors
doctorRoutes.put(
  "/updateName/:id",
  authorizeUser,
  doctorController.updateDocAccountName
);
doctorRoutes.put(
  "/updateContact/:id",
  authorizeUser,
  doctorController.updateDocAccountContact
);
doctorRoutes.put("/updateDOB/:id", doctorController.updateDocAccountDOB);
doctorRoutes.put(
  "/updateProfession/:id",
  authorizeUser,
  doctorController.updateDocAccountProfession
);

// Google login for FaceAuth
doctorRoutes.get("/faceAuth/:id", doctorController.getDoctorByIDFaceAuth);

doctorRoutes.delete("/:id", authorizeUser, doctorController.deleteDoctor); // DELETE for deleting doctors
// ========== Export ==========
module.exports = doctorRoutes;
