const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Appointment {
  constructor(AppointmentID, PatientID, DoctorID, endDateTime) {
    this.AppointmentID = AppointmentID;
    this.PatientID = PatientID;
    this.DoctorID = DoctorID;
    this.endDateTime = endDateTime;
  }

  static async getAllAppointments() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Appointment`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Appointment(
          row.AppointmentID,
          row.PatientID,
          row.DoctorID,
          row.endDateTime
        )
    );
  }

  static async getAppointmentById(AppointmentID) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Appointment WHERE AppointmentID = @AppointmentID`;

    const request = connection.request();
    request.input("AppointmentID", AppointmentID);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Appointment(
          result.recordset[0].AppointmentID,
          result.recordset[0].PatientID,
          result.recordset[0].DoctorID,
          result.recordset[0].endDateTime
        )
      : null;
  }

  static async createAppointment(newAppointmentData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Appointment (PatientID, DoctorID, endDateTime) VALUES (@PatientID, @DoctorID, @endDateTime); SELECT SCOPE_IDENTITY() AS AppointmentID;`;

    const request = connection.request();
    request.input("PatientID", newAppointmentData.PatientID);
    request.input("DoctorID", newAppointmentData.DoctorID);
    request.input("endDateTime", newAppointmentData.endDateTime);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getAppointmentById(result.recordset[0].AppointmentID);
  }

  static async updateAppointment(AppointmentID, newAppointmentData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Appointment SET PatientID = @PatientID, DoctorID = @DoctorID, endDateTime = @endDateTime WHERE AppointmentID = @AppointmentID`;

    const request = connection.request();
    request.input("AppointmentID", AppointmentID);
    request.input("PatientID", newAppointmentData.PatientID || null);
    request.input("DoctorID", newAppointmentData.DoctorID || null);
    request.input("endDateTime", newAppointmentData.endDateTime || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getAppointmentById(AppointmentID);
  }

  static async deleteAppointment(AppointmentID) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Appointment WHERE AppointmentID = @AppointmentID`;

    const request = connection.request();
    request.input("AppointmentID", AppointmentID);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0;
  }
}

module.exports = Appointment;
