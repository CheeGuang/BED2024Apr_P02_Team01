// ========== Packages ==========
// Initializing express
const express = require("express");

// ========== Controllers ==========
// Initializing facialRecognitionController
const facialRecognitionController = require("./controllers/facialRecognitionController");

// ========== Set-up ==========
// Initializing facialRecognitionRoutes
const facialRecognitionRoutes = express.Router();

// ========== Routes ==========
// Route to register a new face descriptor
facialRecognitionRoutes.post("/register", facialRecognitionController.register);

// Route to get all face descriptors
facialRecognitionRoutes.put(
  "/update",
  facialRecognitionController.updateDescriptor
);

// Route to get all face descriptors
facialRecognitionRoutes.get(
  "/descriptors",
  facialRecognitionController.getDescriptors
);

// ========== Export Route ==========
// Export the facial recognition routes to be used in other parts of the application
module.exports = facialRecognitionRoutes;
