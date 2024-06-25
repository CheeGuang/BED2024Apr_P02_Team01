const UserBooks = require("../models/userBooks");

const getAllUserBooks = async (req, res) => {
  try {
    const userBooks = await UserBooks.getAllUserBooks();
    res.json(userBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving userBooks");
  }
};

const getUserBookById = async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const userBooks = await UserBooks.getUserBookById(bookId);
    if (!userBooks) {
      return res.status(404).send("UserBooks not found");
    }
    res.json(userBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving userBooks");
  }
};

const createUserBook = async (req, res) => {
  const newBook = req.body;
  try {
    const createdBook = await UserBooks.createUserBook(newBook);
    res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating userBooks");
  }
};

const updateUserBook = async (req, res) => {
  const bookId = parseInt(req.params.id);
  const newBookData = req.body;

  try {
    const updatedBook = await UserBooks.updateUserBook(bookId, newBookData);
    if (!updatedBook) {
      return res.status(404).send("UserBooks not found");
    }
    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating userBooks");
  }
};

const deleteUserBook = async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const success = await UserBooks.deleteUserBook(bookId);
    if (!success) {
      return res.status(404).send("UserBooks not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting userBooks");
  }
};

const searchUserBooks = async (req, res) => {
  const searchTerm = req.query.searchTerm; // Extract search term from query params
  try {
    const userBooks = await UserBooks.searchUserBooks(searchTerm);
    res.json(userBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching userBooks" });
  }
};

module.exports = {
  getAllUserBooks,
  createUserBook,
  getUserBookById,
  updateUserBook,
  deleteUserBook,
  searchUserBooks,
};
