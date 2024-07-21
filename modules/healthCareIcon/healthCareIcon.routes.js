// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising HealthcareIcon controller
const healthcareIconController = require("./controllers/healthCareIconController");

// ========== Middleware ==========
// Initializing authMiddleware
const authorizeUser = require("../../middlewares/authMiddleware");

// ========== Set-up ==========
// Initialising healthcareIconRoutes
const healthcareIconRoutes = express.Router();

// ========== Routes ==========

healthcareIconRoutes.get(
  "/randomIcon",
  authorizeUser,
  healthcareIconController.getRandomIcons
);

// ========== Export ==========
module.exports = healthcareIconRoutes;
