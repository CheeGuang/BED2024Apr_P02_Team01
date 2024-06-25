const Book = require("../models/book");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving books");
  }
};

const getBookById = async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const book = await Book.getBookById(bookId);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving book");
  }
};

const createBook = async (req, res) => {
  const newBook = req.body;
  try {
    const createdBook = await Book.createBook(newBook);
    res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating book");
  }
};

const updateBook = async (req, res) => {
  const bookId = parseInt(req.params.id);
  const newBookData = req.body;

  try {
    const updatedBook = await Book.updateBook(bookId, newBookData);
    if (!updatedBook) {
      return res.status(404).send("Book not found");
    }
    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating book");
  }
};

const deleteBook = async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const success = await Book.deleteBook(bookId);
    if (!success) {
      return res.status(404).send("Book not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting book");
  }
};

const searchBooks = async (req, res) => {
  const searchTerm = req.query.searchTerm; // Extract search term from query params
  try {
    const books = await Book.searchBooks(searchTerm);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching books" });
  }
};

async function updateBookAvailability(req, res) {
  const { bookId } = req.params;
  const { availability } = req.body;

  if (!["Y", "N"].includes(availability)) {
    return res.status(400).json({ message: "Invalid availability value" });
  }

  try {
    const updatedBook = await Book.updateAvailability(bookId, availability);

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Book availability updated successfully",
      book: updatedBook,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  updateBookAvailability,
};
