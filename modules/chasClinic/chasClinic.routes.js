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

chasClinicRoutes.get("/key", authorizeUser, chasClinicController.getMapApiKey);
chasClinicRoutes.get(
  "/download",
  authorizeUser,
  chasClinicController.downloadChasClinics
);
chasClinicRoutes.get(
  "/random",
  authorizeUser,
  chasClinicController.getRandomClinics
);
chasClinicRoutes.get(
  "/nearest",
  authorizeUser,
  chasClinicController.getNearestClinics
);
chasClinicRoutes.get(
  "/bounds",
  authorizeUser,
  chasClinicController.getClinicsInBounds
);
// ========== Export ==========
module.exports = chasClinicRoutes;
