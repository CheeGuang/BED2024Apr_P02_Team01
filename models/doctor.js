const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Doctor {
  constructor(
    DoctorID,
    Name,
    Email,
    Password,
    ContactNumber,
    DOB,
    Gender,
    Profession,
    resetPasswordCode
  ) {
    this.DoctorID = DoctorID;
    this.Name = Name;
    this.Email = Email;
    this.Password = Password;
    this.ContactNumber = ContactNumber;
    this.DOB = DOB;
    this.Gender = Gender;
    this.Profession = Profession;
    this.resetPasswordCode = resetPasswordCode;
  }

  static async getAllDoctors() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Doctor`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Doctor(
          row.DoctorID,
          row.Name,
          row.Email,
          row.Password,
          row.ContactNumber,
          row.DOB,
          row.Gender,
          row.Profession,
          row.resetPasswordCode
        )
    );
  }

  static async getDoctorById(DoctorID) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Doctor WHERE DoctorID = @DoctorID`;

    const request = connection.request();
    request.input("DoctorID", DoctorID);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Doctor(
          result.recordset[0].DoctorID,
          result.recordset[0].Name,
          result.recordset[0].Email,
          result.recordset[0].Password,
          result.recordset[0].ContactNumber,
          result.recordset[0].DOB,
          result.recordset[0].Gender,
          result.recordset[0].Profession,
          result.recordset[0].resetPasswordCode
        )
      : null;
  }

  static async createDoctor(newDoctorData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Doctor (Name, Email, Password, ContactNumber, DOB, Gender, Profession, resetPasswordCode) VALUES (@Name, @Email, @Password, @ContactNumber, @DOB, @Gender, @Profession, @resetPasswordCode); SELECT SCOPE_IDENTITY() AS DoctorID;`;

    const request = connection.request();
    request.input("Name", newDoctorData.Name);
    request.input("Email", newDoctorData.Email);
    request.input("Password", newDoctorData.Password);
    request.input("ContactNumber", newDoctorData.ContactNumber);
    request.input("DOB", newDoctorData.DOB);
    request.input("Gender", newDoctorData.Gender);
    request.input("Profession", newDoctorData.Profession);
    request.input("resetPasswordCode", newDoctorData.resetPasswordCode);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getDoctorById(result.recordset[0].DoctorID);
  }

  static async updateDoctor(DoctorID, newDoctorData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Doctor SET Name = @Name, Email = @Email, Password = @Password, ContactNumber = @ContactNumber, DOB = @DOB, Gender = @Gender, Profession = @Profession, resetPasswordCode = @resetPasswordCode WHERE DoctorID = @DoctorID`;

    const request = connection.request();
    request.input("DoctorID", DoctorID);
    request.input("Name", newDoctorData.Name || null);
    request.input("Email", newDoctorData.Email || null);
    request.input("Password", newDoctorData.Password || null);
    request.input("ContactNumber", newDoctorData.ContactNumber || null);
    request.input("DOB", newDoctorData.DOB || null);
    request.input("Gender", newDoctorData.Gender || null);
    request.input("Profession", newDoctorData.Profession || null);
    request.input("resetPasswordCode", newDoctorData.resetPasswordCode || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getDoctorById(DoctorID);
  }

  static async deleteDoctor(DoctorID) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Doctor WHERE DoctorID = @DoctorID`;

    const request = connection.request();
    request.input("DoctorID", DoctorID);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0;
  }
}

module.exports = Doctor;
