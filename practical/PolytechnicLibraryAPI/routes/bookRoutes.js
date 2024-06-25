const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/authMiddleware");
const booksController = require("../controllers/booksController");
const validateBook = require("../middlewares/validateBook");

// Route to view all books (accessible by members and librarians)
router.get("/", verifyJWT, booksController.getAllBooks);

// Book Routes
router.post("/", validateBook, booksController.createBook); // POST for creating books (can handle JSON data)
router.get("/search", verifyJWT, booksController.searchBooks);
router.get("/:id", verifyJWT, booksController.getBookById);
router.put("/:id", verifyJWT, booksController.updateBook); // PUT for updating books
router.delete("/:id", verifyJWT, booksController.deleteBook); // DELETE for deleting books

// Route to update book availability (accessible by librarians only)
router.put(
  "/:bookId/availability",
  verifyJWT,
  booksController.updateBookAvailability
);

module.exports = router;
