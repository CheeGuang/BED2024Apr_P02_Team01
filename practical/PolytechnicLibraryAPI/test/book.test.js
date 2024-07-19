// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        book_id: 1, // Ensure this matches the column name in your database
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        book_id: 2, // Ensure this matches the column name in your database
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
    expect(books[1]).toBeInstanceOf(Book);
    expect(books[1].id).toBe(2);
    expect(books[1].title).toBe("The Hitchhiker's Guide to the Galaxy");
    expect(books[1].author).toBe("Douglas Adams");
    expect(books[1].availability).toBe("N");
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

describe("Book.updateAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the availability of a book", async () => {
    const mockUpdatedBook = {
      id: 1,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      availability: "N",
    };

    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({}),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    // Mock the getBookById method to return the updated book
    Book.getBookById = jest.fn().mockResolvedValue(mockUpdatedBook);

    const updatedBook = await Book.updateAvailability(1, "N");

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockRequest.input).toHaveBeenCalledWith("id", 1);
    expect(mockRequest.input).toHaveBeenCalledWith("availability", "N");
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(Book.getBookById).toHaveBeenCalledWith(1);
    expect(updatedBook).toEqual(mockUpdatedBook);
  });

  it("should return null if book with the given id does not exist", async () => {
    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({}),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    // Mock the getBookById method to return null
    Book.getBookById = jest.fn().mockResolvedValue(null);

    const updatedBook = await Book.updateAvailability(1, "N");

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockRequest.input).toHaveBeenCalledWith("id", 1);
    expect(mockRequest.input).toHaveBeenCalledWith("availability", "N");
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(Book.getBookById).toHaveBeenCalledWith(1);
    expect(updatedBook).toBeNull();
  });

  it("should handle errors when updating book availability", async () => {
    const errorMessage = "Database Error";
    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    await expect(Book.updateAvailability(999, "N")).rejects.toThrow(
      errorMessage
    );
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockRequest.input).toHaveBeenCalledWith("id", 999);
    expect(mockRequest.input).toHaveBeenCalledWith("availability", "N");
    expect(mockConnection.close).toHaveBeenCalledTimes(0);
  });
});
