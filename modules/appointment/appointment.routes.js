// ========== Packages ==========
// Initializing express
const express = require("express");
const { appointmentEmitter } = require("../../models/appointment");

// ========== Controllers ==========
// Initializing appointmentController
const appointmentController = require("./controllers/appointmentController");

// ========== Middleware ==========
// Initializing authMiddleware
const authorizeUser = require("../../middlewares/authMiddleware");

// ========== Set-up ==========
// Initializing appointmentRoutes
const appointmentRoutes = express.Router();

// ========== Routes ==========
// Get all appointments
appointmentRoutes.get(
  "/",
  authorizeUser,
  appointmentController.getAllAppointments
);

// Create a new appointment
appointmentRoutes.post(
  "/create",
  authorizeUser,
  appointmentController.createAppointment
);

// Get all unassigned appointments (appointments with no assigned doctor)
appointmentRoutes.get(
  "/unassigned",
  authorizeUser,
  appointmentController.getUnassignedAppointments
);

// Get a specific appointment by its ID
appointmentRoutes.get(
  "/:id",
  authorizeUser,
  appointmentController.getAppointmentById
);

// Update a specific appointment by its ID
appointmentRoutes.put(
  "/:id",
  authorizeUser,
  appointmentController.updateAppointment
);

// Delete a specific appointment by its ID
appointmentRoutes.delete(
  "/:id",
  authorizeUser,
  appointmentController.deleteAppointment
);

// Get all appointments for a specific patient by their ID
appointmentRoutes.get(
  "/getByPatientID/:id",
  authorizeUser,
  appointmentController.getAppointmentsByPatientId
);

// Get all appointments for a specific doctor by their ID
appointmentRoutes.get(
  "/getByDoctorID/:id",
  authorizeUser,
  appointmentController.getAppointmentsByDoctorId
);

// Update the doctor ID of a specific appointment by its ID
appointmentRoutes.put(
  "/:id/updateDoctorId",
  authorizeUser,
  appointmentController.updateDoctorId
);

// Update the medicines for a specific appointment by its ID
appointmentRoutes.put(
  "/:id/updateWithMedicines",
  authorizeUser,
  appointmentController.updateAppointmentWithMedicines
);

appointmentRoutes.get(
  "/:id/details",
  authorizeUser,
  appointmentController.getAppointmentDetailsById
);

appointmentRoutes.get(
  "/:id/medicalCertificate",
  authorizeUser,
  appointmentController.generateMedicalCertificate
);

// Endpoint to listen for updates (SSE)
appointmentRoutes.get("/:id/updates", appointmentController.handleSSEUpdates);

// ========== Export Route ==========
// Export the appointment routes to be used in other parts of the application
module.exports = appointmentRoutes;
