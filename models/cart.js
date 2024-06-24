const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Cart {
  constructor(CartID, PatientID, MedicineID, Quantity) {
    this.CartID = CartID;
    this.PatientID = PatientID;
    this.MedicineID = MedicineID;
    this.Quantity = Quantity;
  }

  static async getCart(patientId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Cart WHERE PatientID = @patientId`;
    const request = connection.request();
    request.input("patientId", patientId);
    const result = await request.query(sqlQuery);
    connection.close();
  
    // Convert cart items to an array of objects
    const cartItems = result.recordset.map((item) => ({
      ProductID: item.ProductID,
      Quantity: item.Quantity,
    }));
  
    return cartItems;
  }
  
  static async addToCart(patientId, productId, quantity) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Cart (PatientID, ProductID, Quantity) VALUES (@patientId, @productId, @quantity)`;
    const request = connection.request();
    request.input("patientId", patientId);
    request.input("productId", productId);
    request.input("quantity", quantity);
    await request.query(sqlQuery);
    connection.close();
  }
  
  static async removeFromCart(patientId, productId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM Cart WHERE PatientID = @patientId AND ProductID = @productId`;
    const request = connection.request();
    request.input("patientId", patientId);
    request.input("productId", productId);
    await request.query(sqlQuery);
    connection.close();
  }
  
  static async updateCartItemQuantity(patientId, productId, newQuantity) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `UPDATE Cart SET Quantity = @newQuantity WHERE PatientID = @patientId AND ProductID = @productId`;
    const request = connection.request();
    request.input("patientId", patientId);
    request.input("productId", productId);
    request.input("newQuantity", newQuantity);
    await request.query(sqlQuery);
    connection.close();
  }
}

module.exports = Cart;
