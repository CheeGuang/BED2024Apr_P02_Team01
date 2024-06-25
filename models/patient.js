const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Patient {
  constructor(
    PatientID,
    Name,
    Email,
    Password,
    ContactNumber,
    DOB,
    Gender,
    Address,
    eWalletAmount,
    resetPasswordCode,
    PCHI
  ) {
    this.PatientID = PatientID;
    this.Name = Name;
    this.Email = Email;
    this.Password = Password;
    this.ContactNumber = ContactNumber;
    this.DOB = DOB;
    this.Gender = Gender;
    this.Address = Address;
    this.eWalletAmount = eWalletAmount;
    this.resetPasswordCode = resetPasswordCode;
    this.PCHI = PCHI;
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
          row.Name,
          row.Email,
          row.Password,
          row.ContactNumber,
          row.DOB,
          row.Gender,
          row.Address,
          row.eWalletAmount,
          row.resetPasswordCode,
          row.PCHI
        )
    );
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
          result.recordset[0].Name,
          result.recordset[0].Email,
          result.recordset[0].Password,
          result.recordset[0].ContactNumber,
          result.recordset[0].DOB,
          result.recordset[0].Gender,
          result.recordset[0].Address,
          result.recordset[0].eWalletAmount,
          result.recordset[0].resetPasswordCode,
          result.recordset[0].PCHI
        )
      : null;
  }

  static async createPatient(newPatientData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Patient (Name, Email, Password, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI) 
                      VALUES (@Name, @Email, @Password, @ContactNumber, @DOB, @Gender, @Address, @eWalletAmount, @resetPasswordCode, @PCHI); 
                      SELECT SCOPE_IDENTITY() AS PatientID;`;

    const request = connection.request();
    request.input("Name", newPatientData.Name);
    request.input("Email", newPatientData.Email);
    request.input("Password", newPatientData.Password);
    request.input("ContactNumber", newPatientData.ContactNumber);
    request.input("DOB", newPatientData.DOB);
    request.input("Gender", newPatientData.Gender);
    request.input("Address", newPatientData.Address);
    request.input("eWalletAmount", newPatientData.eWalletAmount);
    request.input("resetPasswordCode", newPatientData.resetPasswordCode);
    request.input("PCHI", newPatientData.PCHI);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getPatientById(result.recordset[0].PatientID);
  }

  static async updatePatient(id, newPatientData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Patient SET 
                        Name = @Name, 
                        Email = @Email, 
                        Password = @Password, 
                        ContactNumber = @ContactNumber, 
                        DOB = @DOB, 
                        Gender = @Gender, 
                        Address = @Address, 
                        eWalletAmount = @eWalletAmount, 
                        resetPasswordCode = @resetPasswordCode, 
                        PCHI = @PCHI 
                      WHERE PatientID = @id`;

    const request = connection.request();
    request.input("id", id);
    request.input("Name", newPatientData.Name);
    request.input("Email", newPatientData.Email);
    request.input("Password", newPatientData.Password);
    request.input("ContactNumber", newPatientData.ContactNumber);
    request.input("DOB", newPatientData.DOB);
    request.input("Gender", newPatientData.Gender);
    request.input("Address", newPatientData.Address);
    request.input("eWalletAmount", newPatientData.eWalletAmount);
    request.input("resetPasswordCode", newPatientData.resetPasswordCode);
    request.input("PCHI", newPatientData.PCHI);

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
        WHERE Name LIKE '%${searchTerm}%'
          OR Email LIKE '%${searchTerm}%'
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

}
module.exports = Patient;
