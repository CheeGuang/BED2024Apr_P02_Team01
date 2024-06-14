// ========== Packages ==========
// Initialising express
const express = require("express");
const passport = require("passport");

// ========== Controllers ==========
// Initialising dbConfig file
const {
  googleLogin,
  createPatient,
} = require("../patient/controllers/patientController");

// ========== Set-up ==========
// Initialising authenticateRoutes
const authenticateRoutes = express.Router();

// ========== Routes ==========
// Define routes for the Authenticate
authenticateRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authenticateRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) {
      res.redirect("../../public/patientSignUp.html");
    } else {
      res.redirect("/"); // Redirect to home page or wherever
    }
  }
);

authenticateRoutes.post("/patients", createPatient);

// ========== Export ==========
module.exports = authenticateRoutes;
