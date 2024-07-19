// booksController.test.js

const booksController = require("../controllers/booksController");
const Book = require("../models/book");

// Mock the Book model
jest.mock("../models/book.js"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});

describe("booksController.updateBookAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should update book availability and return a JSON response", async () => {
    const mockBook = {
      id: 1,
      title: "The Lord of the Rings",
      availability: "Y",
    };

    // Mock the Book.updateAvailability function to return the mock data
    Book.updateAvailability = jest.fn().mockResolvedValue(mockBook);

    const req = {
      params: { bookId: 1 },
      body: { availability: "Y" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.updateBookAvailability(req, res);

    expect(Book.updateAvailability).toHaveBeenCalledWith(1, "Y"); // Check if updateAvailability was called with correct arguments
    expect(res.status).toHaveBeenCalledWith(200); // Check if status 200 was set
    expect(res.json).toHaveBeenCalledWith({
      message: "Book availability updated successfully",
      book: mockBook,
    }); // Check the response body
  });

  it("should return 400 if the availability value is invalid", async () => {
    const req = {
      params: { bookId: 1 },
      body: { availability: "InvalidValue" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBookAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Check if status 400 was set
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid availability value",
    }); // Check the response body
  });

  it("should return 404 if the book is not found", async () => {
    // Mock the Book.updateAvailability function to return null
    Book.updateAvailability = jest.fn().mockResolvedValue(null);

    const req = {
      params: { bookId: 1 },
      body: { availability: "Y" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBookAvailability(req, res);

    expect(Book.updateAvailability).toHaveBeenCalledWith(1, "Y"); // Check if updateAvailability was called with correct arguments
    expect(res.status).toHaveBeenCalledWith(404); // Check if status 404 was set
    expect(res.json).toHaveBeenCalledWith({ message: "Book not found" }); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Internal server error";
    Book.updateAvailability = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {
      params: { bookId: 1 },
      body: { availability: "Y" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBookAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(500); // Check if status 500 was set
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" }); // Check the response body
  });
});
