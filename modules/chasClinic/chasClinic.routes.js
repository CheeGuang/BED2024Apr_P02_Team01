// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising dbConfig file
const chasClinicController = require("./controllers/chasClinicController");

// ========== Middleware ==========
// Initializing authMiddleware
const authorizeUser = require("../../middlewares/authMiddleware");

// ========== Set-up ==========
// Initialising chasClinicRoutes
const chasClinicRoutes = express.Router();

// ========== Routes ==========
// Define routes for the doctor
chasClinicRoutes.get("/", authorizeUser, chasClinicController.getMapApiKey);
// ========== Export ==========
module.exports = chasClinicRoutes;
