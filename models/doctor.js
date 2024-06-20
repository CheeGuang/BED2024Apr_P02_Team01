const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Doctor {
  constructor(
    DoctorID,
    Email,
    ContactNumber,
    DOB,
    Gender,
    Profession,
    resetPasswordCode,
    googleId, // New field for Google ID
    givenName, // New field for Google given name
    familyName, // New field for Google family name
    profilePicture // New field for Google profile picture
  ) {
    this.DoctorID = DoctorID;
    this.Email = Email;
    this.ContactNumber = ContactNumber;
    this.DOB = DOB;
    this.Gender = Gender;
    this.Profession = Profession;
    this.resetPasswordCode = resetPasswordCode;
    this.googleId = googleId;
    this.givenName = givenName;
    this.familyName = familyName;
    this.profilePicture = profilePicture;
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
          row.Email,
          row.ContactNumber,
          row.DOB,
          row.Gender,
          row.Profession,
          row.resetPasswordCode,
          row.googleId,
          row.givenName,
          row.familyName,
          row.profilePicture
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
          result.recordset[0].Email,
          result.recordset[0].ContactNumber,
          result.recordset[0].DOB,
          result.recordset[0].Gender,
          result.recordset[0].Profession,
          result.recordset[0].resetPasswordCode,
          result.recordset[0].googleId,
          result.recordset[0].givenName,
          result.recordset[0].familyName,
          result.recordset[0].profilePicture
        )
      : null;
  }

  static async createDoctor(newDoctorData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Doctor (Email, ContactNumber, DOB, Gender, Profession, resetPasswordCode, googleId, givenName, familyName, profilePicture) VALUES (@Email, @ContactNumber, @DOB, @Gender, @Profession, @resetPasswordCode, @googleId, @givenName, @familyName, @profilePicture); SELECT SCOPE_IDENTITY() AS DoctorID;`;

    const request = connection.request();
    request.input("Email", newDoctorData.Email);
    request.input("ContactNumber", newDoctorData.ContactNumber);
    request.input("DOB", newDoctorData.DOB);
    request.input("Gender", newDoctorData.Gender);
    request.input("Profession", newDoctorData.Profession);
    request.input("resetPasswordCode", newDoctorData.resetPasswordCode);
    request.input("googleId", newDoctorData.googleId);
    request.input("givenName", newDoctorData.givenName);
    request.input("familyName", newDoctorData.familyName);
    request.input("profilePicture", newDoctorData.profilePicture);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getDoctorById(result.recordset[0].DoctorID);
  }

  static async updateDoctor(DoctorID, newDoctorData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Doctor SET Email = @Email, ContactNumber = @ContactNumber, DOB = @DOB, Gender = @Gender, Profession = @Profession, resetPasswordCode = @resetPasswordCode, googleId = @googleId, givenName = @givenName, familyName = @familyName, profilePicture = @profilePicture WHERE DoctorID = @DoctorID`;

    const request = connection.request();
    request.input("DoctorID", DoctorID);
    request.input("Email", newDoctorData.Email || null);
    request.input("ContactNumber", newDoctorData.ContactNumber || null);
    request.input("DOB", newDoctorData.DOB || null);
    request.input("Gender", newDoctorData.Gender || null);
    request.input("Profession", newDoctorData.Profession || null);
    request.input("resetPasswordCode", newDoctorData.resetPasswordCode || null);
    request.input("googleId", newDoctorData.googleId || null);
    request.input("givenName", newDoctorData.givenName || null);
    request.input("familyName", newDoctorData.familyName || null);
    request.input("profilePicture", newDoctorData.profilePicture || null);

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

  static async findOrCreateGoogleUser(googleUserData) {
    console.log("findOrCreateGoogleUser called with data:", googleUserData);

    const connection = await sql.connect(dbConfig);
    console.log("Database connection established");

    // Find existing user
    const findQuery = `SELECT * FROM Doctor WHERE googleId = @googleId`;
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
    const createQuery = `INSERT INTO Doctor (Email, ContactNumber, DOB, Gender, Profession, resetPasswordCode, googleId, givenName, familyName, profilePicture) VALUES (@Email, @ContactNumber, @DOB, @Gender, @Profession, @resetPasswordCode, @googleId, @givenName, @familyName, @profilePicture); SELECT SCOPE_IDENTITY() AS DoctorID;`;

    let createRequest = connection.request();
    createRequest.input("Email", googleUserData.Email);
    createRequest.input("ContactNumber", googleUserData.ContactNumber);
    createRequest.input("DOB", googleUserData.DOB);
    createRequest.input("Gender", googleUserData.Gender);
    createRequest.input("Profession", googleUserData.Profession);
    createRequest.input("resetPasswordCode", googleUserData.resetPasswordCode);
    createRequest.input("googleId", googleUserData.googleId);
    createRequest.input("givenName", googleUserData.givenName);
    createRequest.input("familyName", googleUserData.familyName);
    createRequest.input("profilePicture", googleUserData.profilePicture);

    result = await createRequest.query(createQuery);
    console.log("Create query executed, result:", result);
    connection.close();

    const newDoctor = await this.getDoctorById(result.recordset[0].DoctorID);
    console.log("New user created and retrieved:", newDoctor);
    return newDoctor;
  }
}

module.exports = Doctor;
