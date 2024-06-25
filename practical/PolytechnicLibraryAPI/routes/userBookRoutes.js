const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/authMiddleware");
const userBooksController = require("../controllers/userBooksController");

// UserBook Routes
router.get("/", verifyJWT, userBooksController.getAllUserBooks);
router.post("/", verifyJWT, userBooksController.createUserBook); // POST for creating userBooks (can handle JSON data)
router.get("/search", verifyJWT, userBooksController.searchUserBooks);
router.get("/:id", verifyJWT, userBooksController.getUserBookById);
router.put("/:id", verifyJWT, userBooksController.updateUserBook); // PUT for updating userBooks
router.delete("/:id", verifyJWT, userBooksController.deleteUserBook); // DELETE for deleting userBooks

module.exports = router;
