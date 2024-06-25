const sql = require("mssql");
const dbConfig = require("../dbConfig");

class UserBooks {
  constructor(id, user_id, book_id) {
    this.id = id;
    this.user_id = user_id;
    this.book_id = book_id;
  }

  static async getAllUserBooks() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM UserBooks`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new UserBooks(row.id, row.user_id, row.book_id)
    ); // Convert rows to UserBooks objects
  }

  static async getUserBookById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM UserBooks WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new UserBooks(
          result.recordset[0].id,
          result.recordset[0].user_id,
          result.recordset[0].book_id
        )
      : null; // Handle UserBooks not found
  }

  static async createUserBook(newBookData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO UserBooks (user_id, book_id) VALUES (@user_id, @book_id); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("user_id", newBookData.user_id);
    request.input("book_id", newBookData.book_id);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created UserBooks using its ID
    return this.getUserBookById(result.recordset[0].id);
  }

  static async updateBook(id, newBookData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE UserBooks SET user_id = @user_id, book_id = @book_id WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("user_id", newBookData.user_id || null); // Handle optional fields
    request.input("book_id", newBookData.book_id || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserBookById(id); // returning the updated UserBooks data
  }

  static async deleteUserBook(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM UserBooks WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

  static async searchUserBooks(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT *
        FROM UserBooks
        WHERE user_id LIKE '%${searchTerm}%'
          OR book_id LIKE '%${searchTerm}%'
      `;

      const result = await connection.request().query(query);

      return result.recordset;
    } catch (error) {
      throw new Error("Error searching UserBooks"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }
}

module.exports = UserBooks;
