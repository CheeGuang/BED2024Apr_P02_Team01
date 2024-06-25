const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book {
  constructor(id, title, author, availability) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.availability = availability;
  }

  static async getAllBooks() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = "SELECT * FROM Books"; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Book(row.book_id, row.title, row.author, row.availability)
    ); // Convert rows to Book objects
  }

  static async getBookById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Book(
          result.recordset[0].id,
          result.recordset[0].title,
          result.recordset[0].author,
          result.recordset[0].availability
        )
      : null; // Handle book not found
  }

  static async createBook(newBookData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("title", newBookData.title);
    request.input("author", newBookData.author);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created book using its ID
    return this.getBookById(result.recordset[0].id);
  }

  static async updateBook(id, newBookData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Books SET title = @title, author = @author WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("title", newBookData.title || null); // Handle optional fields
    request.input("author", newBookData.author || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getBookById(id); // returning the updated book data
  }

  static async deleteBook(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Books WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

  static async searchBooks(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT *
        FROM Books
        WHERE title LIKE '%${searchTerm}%'
          OR author LIKE '%${searchTerm}%'
      `;

      const result = await connection.request().query(query);

      return result.recordset;
    } catch (error) {
      throw new Error("Error searching books"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }

  static async updateAvailability(id, availability) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery =
      "UPDATE Books SET availability = @availability WHERE id = @id";

    const request = connection.request();

    request.input("id", id);
    request.input("availability", availability);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getBookById(id);
  }
}

module.exports = Book;
