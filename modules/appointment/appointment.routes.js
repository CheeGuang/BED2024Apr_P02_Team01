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

// Get all unassigned appointments (appointments with no assigned doctor)
appointmentRoutes.get(
  "/unassigned",
  appointmentController.getUnassignedAppointments
);

// Get a specific appointment by its ID
appointmentRoutes.get("/:id", appointmentController.getAppointmentById);

// Update a specific appointment by its ID
appointmentRoutes.put("/:id", appointmentController.updateAppointment);

// Delete a specific appointment by its ID
appointmentRoutes.delete("/:id", appointmentController.deleteAppointment);

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

// Update the doctor ID of a specific appointment by its ID
appointmentRoutes.put(
  "/:id/updateDoctorId",
  appointmentController.updateDoctorId
);

// Add medicines to a specific appointment by its ID
appointmentRoutes.post(
  "/:id/addMedicines",
  appointmentController.addMedicinesToAppointment
);

// Update the medicines for a specific appointment by its ID
appointmentRoutes.put(
  "/:id/updateMedicines",
  appointmentController.updateMedicinesForAppointment
);

// Get all medicines for a specific appointment by its ID
appointmentRoutes.get(
  "/:id/medicines",
  appointmentController.getMedicinesForAppointment
);

appointmentRoutes.put(
  "/:id/updateWithMedicines",
  appointmentController.updateAppointmentWithMedicines
);

appointmentRoutes.post(
  "/:id/medicineToAppointment",
  appointmentController.addMedicinesToAppointment
);

// ========== Export Route ==========
// Export the appointment routes to be used in other parts of the application
module.exports = appointmentRoutes;
