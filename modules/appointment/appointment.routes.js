// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising getAppointmentLink
const getAppointmentLink = require("./controllers/getAppointmentLink");
// Initialising createAppointment
const createAppointment = require("./controllers/createAppointment");

// ========== Set-up ==========
// Initialising appointmentRoutes
const appointmentRoutes = express.Router();

// ========== Routes ==========
// GET Appointment Link
appointmentRoutes.get("/", getAppointmentLink);
// POST Appointment Link
appointmentRoutes.post("/create", createAppointment);

// ========== Export Route ==========
module.exports = appointmentRoutes;
