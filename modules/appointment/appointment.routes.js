// ========== Packages ==========
// Initializing express
const express = require("express");

// ========== Controllers ==========
// Initializing appointmentController
const appointmentController = require("./controllers/appointmentController");

// ========== Set-up ==========
// Initializing appointmentRoutes
const appointmentRoutes = express.Router();

// ========== Routes ==========
// Get all appointments
appointmentRoutes.get("/", appointmentController.getAllAppointments);

// Create a new appointment
appointmentRoutes.post("/create", appointmentController.createAppointment);

// Get all appointments for a specific patient by their ID
appointmentRoutes.get(
  "/getByPatientID/:id",
  appointmentController.getAppointmentsByPatientId
);

// Get all appointments for a specific doctor by their ID
appointmentRoutes.get(
  "/getByDoctorID/:id",
  appointmentController.getAppointmentsByDoctorId
);

// Get all unassigned appointments (appointments with no assigned doctor)
appointmentRoutes.get(
  "/unassigned",
  appointmentController.getUnassignedAppointments
);

// Get a specific appointment by its ID
appointmentRoutes.get("/:id", appointmentController.getAppointmentById);

// Update a specific appointment by its ID
appointmentRoutes.put("/:id", appointmentController.updateAppointment);

// Update the doctor ID of a specific appointment by its ID
appointmentRoutes.put(
  "/:id/updateDoctorId",
  appointmentController.updateDoctorId
);

// Delete a specific appointment by its ID
appointmentRoutes.delete("/:id", appointmentController.deleteAppointment);

// ========== Export Route ==========
// Export the appointment routes to be used in other parts of the application
module.exports = appointmentRoutes;
