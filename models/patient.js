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
  }

  static async findOrCreateGoogleUser(googleUserData) {
    console.log("findOrCreateGoogleUser called with data:", googleUserData);

    const connection = await sql.connect(dbConfig);
    console.log("Database connection established");

    const findQuery = `SELECT * FROM Patient WHERE googleId = @googleId`;
    const request = connection.request();
    request.input("googleId", googleUserData.googleId);
    let result = await request.query(findQuery);
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

    request.input("Email", googleUserData.Email);
    request.input("ContactNumber", googleUserData.ContactNumber);
    request.input("DOB", googleUserData.DOB);
    request.input("Gender", googleUserData.Gender);
    request.input("Address", googleUserData.Address);
    request.input("eWalletAmount", googleUserData.eWalletAmount);
    request.input("resetPasswordCode", googleUserData.resetPasswordCode);
    request.input("PCHI", googleUserData.PCHI);
    request.input("googleId", googleUserData.googleId);
    request.input("givenName", googleUserData.givenName);
    request.input("familyName", googleUserData.familyName);
    request.input("profilePicture", googleUserData.profilePicture);

    result = await request.query(createQuery);
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
          result.recordset[0].googleId,
          result.recordset[0].givenName,
          result.recordset[0].familyName,
          result.recordset[0].profilePicture
        )
      : null;
  }

  static async createPatient(newPatientData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Patient (Email, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI, googleId, givenName, familyName, profilePicture) 
                      VALUES (@Email, @ContactNumber, @DOB, @Gender, @Address, @eWalletAmount, @resetPasswordCode, @PCHI, @googleId, @givenName, @familyName, @profilePicture); 
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

  static async getAllPatients() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Patient`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Patient(
          row.PatientID,
          row.Email,
          row.ContactNumber,
          row.DOB,
          row.Gender,
          row.Address,
          row.eWalletAmount,
          row.resetPasswordCode,
          row.PCHI,
          row.googleId,
          row.givenName,
          row.familyName,
          row.profilePicture
        )
    );
  }
}

module.exports = Patient;
