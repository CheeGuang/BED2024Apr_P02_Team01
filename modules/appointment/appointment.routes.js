// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising appointmentController
const appointmentController = require("./controllers/CRUDAppointmentController");
// Initialising createAppointment
const createAppointment = require("./controllers/createAppointment");
// Initialising getUnassignedAppointments
const getUnassignedAppointments = require("./controllers/getUnassignedAppointment");

// ========== Set-up ==========
// Initialising appointmentRoutes
const appointmentRoutes = express.Router();

// ========== Routes ==========
// GET Appointment
appointmentRoutes.get("/", appointmentController.getAllAppointments);
// POST Appointment
appointmentRoutes.post("/create", createAppointment);
appointmentRoutes.get(
  "/getByPatientID/:id",
  appointmentController.getAppointmentsByPatientId
);
appointmentRoutes.get(
  "/getByDoctorID/:id",
  appointmentController.getAppointmentsByDoctorId
);
appointmentRoutes.get("/unassigned", getUnassignedAppointments);
appointmentRoutes.get("/:id", appointmentController.getAppointmentById);
appointmentRoutes.put("/:id", appointmentController.updateAppointment); // PUT for updating appointments
appointmentRoutes.delete("/:id", appointmentController.deleteAppointment); // DELETE for deleting appointments

// ========== Export Route ==========
module.exports = appointmentRoutes;
