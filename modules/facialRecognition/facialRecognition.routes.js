// ========== Packages ==========
// Initializing express
const express = require("express");

// ========== Controllers ==========
// Initializing facialRecognitionController
const facialRecognitionController = require("./controllers/facialRecognitionController");

// ========== Set-up ==========
// Initializing facialRecognitionRoutes
const facialRecognitionRoutes = express.Router();

// ========== Middleware ==========
// Initializing authMiddleware
const authorizeUser = require("../../middlewares/authMiddleware");

// ========== Routes ==========
// Route to register a new face descriptor
facialRecognitionRoutes.post(
  "/register",
  authorizeUser,
  facialRecognitionController.register
);

// Route to get all face descriptors
facialRecognitionRoutes.put(
  "/update",
  authorizeUser,
  facialRecognitionController.updateDescriptor
);

// Route to get all face descriptors
facialRecognitionRoutes.delete(
  "/delete",
  authorizeUser,
  facialRecognitionController.deleteDescriptor
);

// Route to get all face descriptors
facialRecognitionRoutes.get(
  "/descriptors",
  facialRecognitionController.getDescriptors
);

// ========== Export Route ==========
// Export the facial recognition routes to be used in other parts of the application
module.exports = facialRecognitionRoutes;
