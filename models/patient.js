const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Patient {
  constructor(
    PatientID,
    Email,
    ContactNumber,
    DOB,
    Gender,
    Address,
    eWalletAmount,
    resetPasswordCode,
    PCHI,
    Cart = {},
    googleId, // New field for Google ID
    givenName, // New field for Google given name
    familyName, // New field for Google family name
    profilePicture // New field for Google profile picture
  ) {
    this.PatientID = PatientID;
    this.Email = Email;
    this.ContactNumber = ContactNumber;
    this.DOB = DOB;
    this.Gender = Gender;
    this.Address = Address;
    this.eWalletAmount = eWalletAmount;
    this.resetPasswordCode = resetPasswordCode;
    this.PCHI = PCHI;
    this.googleId = googleId;
    this.givenName = givenName;
    this.familyName = familyName;
    this.profilePicture = profilePicture;
    this.Cart = Cart;
  }

  static async findOrCreateGoogleUser(googleUserData) {
    console.log("findOrCreateGoogleUser called with data:", googleUserData);

    const connection = await sql.connect(dbConfig);
    console.log("Database connection established");

    // Find existing user
    const findQuery = `SELECT * FROM Patient WHERE googleId = @googleId`;
    let findRequest = connection.request();
    findRequest.input("googleId", googleUserData.googleId);
    let result = await findRequest.query(findQuery);
    console.log("Find query executed, result:", result);

    if (result.recordset.length > 0) {
      console.log("User found:", result.recordset[0]);
      connection.close();
      return result.recordset[0];
    }

    console.log("User not found, creating new user");
    const createQuery = `INSERT INTO Patient (Email, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI, googleId, givenName, familyName, profilePicture) 
                         VALUES (@Email, @ContactNumber, @DOB, @Gender, @Address, @eWalletAmount, @resetPasswordCode, @PCHI, @googleId, @givenName, @familyName, @profilePicture); 
                         SELECT SCOPE_IDENTITY() AS PatientID;`;

    let createRequest = connection.request();
    createRequest.input("Email", googleUserData.Email);
    createRequest.input("ContactNumber", googleUserData.ContactNumber);
    createRequest.input("DOB", googleUserData.DOB);
    createRequest.input("Gender", googleUserData.Gender);
    createRequest.input("Address", googleUserData.Address);
    createRequest.input("eWalletAmount", googleUserData.eWalletAmount);
    createRequest.input("resetPasswordCode", googleUserData.resetPasswordCode);
    createRequest.input("PCHI", googleUserData.PCHI);
    createRequest.input("googleId", googleUserData.googleId);
    createRequest.input("givenName", googleUserData.givenName);
    createRequest.input("familyName", googleUserData.familyName);
    createRequest.input("profilePicture", googleUserData.profilePicture);

    result = await createRequest.query(createQuery);
    console.log("Create query executed, result:", result);
    connection.close();

    const newPatient = await this.getPatientById(result.recordset[0].PatientID);
    console.log("New user created and retrieved:", newPatient);
    return newPatient;
  }

  static async getPatientById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Patient WHERE PatientID = @id`;
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Patient(
          result.recordset[0].PatientID,
          result.recordset[0].Email,
          result.recordset[0].ContactNumber,
          result.recordset[0].DOB,
          result.recordset[0].Gender,
          result.recordset[0].Address,
          result.recordset[0].eWalletAmount,
          result.recordset[0].resetPasswordCode,
          result.recordset[0].PCHI,
          JSON.parse(result.recordset[0].Cart),
          result.recordset[0].googleId,
          result.recordset[0].givenName,
          result.recordset[0].familyName,
          result.recordset[0].profilePicture
        )
      : null;
  }
  static async getGuestPatient() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Patient WHERE PatientID = 1`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Patient(
          result.recordset[0].PatientID,
          result.recordset[0].Email,
          result.recordset[0].ContactNumber,
          result.recordset[0].DOB,
          result.recordset[0].Gender,
          result.recordset[0].Address,
          result.recordset[0].eWalletAmount,
          result.recordset[0].resetPasswordCode,
          result.recordset[0].PCHI,
          JSON.parse(result.recordset[0].Cart),
          result.recordset[0].googleId,
          result.recordset[0].givenName,
          result.recordset[0].familyName,
          result.recordset[0].profilePicture
        )
      : null;
  }

  static async createPatient(newPatientData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Patient (Email, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI, googleId, givenName, familyName, profilePicture, Cart) 
                      VALUES (@Email, @ContactNumber, @DOB, @Gender, @Address, @eWalletAmount, @resetPasswordCode, @PCHI, @googleId, @givenName, @familyName, @profilePicture, @Cart); 
                      SELECT SCOPE_IDENTITY() AS PatientID;`;

    const request = connection.request();
    request.input("Email", newPatientData.Email);
    request.input("ContactNumber", newPatientData.ContactNumber);
    request.input("DOB", newPatientData.DOB);
    request.input("Gender", newPatientData.Gender);
    request.input("Address", newPatientData.Address);
    request.input("eWalletAmount", newPatientData.eWalletAmount);
    request.input("resetPasswordCode", newPatientData.resetPasswordCode);
    request.input("PCHI", newPatientData.PCHI);
    request.input("googleId", newPatientData.googleId);
    request.input("givenName", newPatientData.givenName);
    request.input("familyName", newPatientData.familyName);
    request.input("profilePicture", newPatientData.profilePicture);
    request.input("Cart", newPatientData.Cart);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getPatientById(result.recordset[0].PatientID);
  }

  static async updatePatient(id, newPatientData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Patient SET 
                        Email = @Email, 
                        ContactNumber = @ContactNumber, 
                        DOB = @DOB, 
                        Gender = @Gender, 
                        Address = @Address, 
                        eWalletAmount = @eWalletAmount, 
                        resetPasswordCode = @resetPasswordCode, 
                        PCHI = @PCHI,
                        Cart = @Cart,
                        googleId = @googleId,
                        givenName = @givenName,
                        familyName = @familyName,
                        profilePicture = @profilePicture 
                      WHERE PatientID = @id`;

    const request = connection.request();
    request.input("id", id);
    request.input("Email", newPatientData.Email);
    request.input("ContactNumber", newPatientData.ContactNumber);
    request.input("DOB", newPatientData.DOB);
    request.input("Gender", newPatientData.Gender);
    request.input("Address", newPatientData.Address);
    request.input("eWalletAmount", newPatientData.eWalletAmount);
    request.input("resetPasswordCode", newPatientData.resetPasswordCode);
    request.input("PCHI", newPatientData.PCHI);
    request.input("googleId", newPatientData.googleId);
    request.input("givenName", newPatientData.givenName);
    request.input("familyName", newPatientData.familyName);
    request.input("profilePicture", newPatientData.profilePicture);
    request.input("Cart", newPatientData.Cart);

    await request.query(sqlQuery);

    connection.close();

    return this.getPatientById(id);
  }

  static async deletePatient(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Patient WHERE PatientID = @id`;

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0;
  }

  static async searchPatients(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT *
        FROM Patient
        WHERE Email LIKE '%${searchTerm}%'
          OR givenName LIKE '%${searchTerm}%'
          OR familyName LIKE '%${searchTerm}%'
      `;

      const result = await connection.request().query(query);

      return result.recordset;
    } catch (error) {
      throw new Error("Error searching patients");
    } finally {
      await connection.close();
    }
  }

  static async updateEWalletAmount(id, amount) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Patient SET eWalletAmount = eWalletAmount + @amount WHERE PatientID = @id`;
    const request = connection.request();
    request.input("id", id);
    request.input("amount", amount);

    await request.query(sqlQuery);

    connection.close();

    return this.getPatientById(id);
  }

  static async updateCart(patientId, newItem) {
    try {
      const patient = await this.getPatientById(patientId);
      if (!patient) {
        throw new Error(`Patient with ID ${patientId} not found`);
      }

      // Merge new item with existing cart
      const updatedCart = { ...patient.Cart, ...newItem };

      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        UPDATE Patient
        SET Cart = @cart
        WHERE PatientID = @id
      `;
      const request = connection.request();
      request.input("cart", JSON.stringify(updatedCart));
      request.input("id", patientId);
      await request.query(sqlQuery);

      connection.close();

      // Return updated patient object (optional)
      return await this.getPatientById(patientId);
    } catch (error) {
      throw new Error(`Error updating patient cart: ${error.message}`);
    }
  }

  static async clearCart(patientId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Patient SET Cart = NULL WHERE PatientID = @id`;

    const request = connection.request();
    request.input("id", patientId);

    await request.query(sqlQuery);

    connection.close();
  }

  static async updateEWalletAmount(id, amount) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Patient SET eWalletAmount = eWalletAmount + @amount WHERE PatientID = @id`;
    const request = connection.request();
    request.input("id", id);
    request.input("amount", amount);

    await request.query(sqlQuery);

    connection.close();

    return this.getPatientById(id);
  }
}
module.exports = Patient;
