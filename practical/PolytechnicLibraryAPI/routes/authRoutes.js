const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Authentication Routes
router.post("/register", usersController.registerUser); // Create user
router.post("/login", usersController.login); // User login

module.exports = router;
