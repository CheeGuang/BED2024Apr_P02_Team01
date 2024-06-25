const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/authMiddleware");
const usersController = require("../controllers/usersController");

// User Routes
router.get("/", verifyJWT, usersController.getAllUsers); // Get all users
router.get("/search", verifyJWT, usersController.searchUsers);
router.get("/with-books", verifyJWT, usersController.getUsersWithBooks);
router.get("/:id", verifyJWT, usersController.getUserById); // Get user by ID
router.put("/:id", verifyJWT, usersController.updateUser); // Update user
router.delete("/:id", verifyJWT, usersController.deleteUser); // Delete user

module.exports = router;
