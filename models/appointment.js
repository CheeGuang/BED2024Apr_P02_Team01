const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Appointment {
  constructor(
    AppointmentID,
    PatientID,
    DoctorID,
    endDateTime,
    PatientURL,
    HostRoomURL,
    illnessDescription
  ) {
    this.AppointmentID = AppointmentID;
    this.PatientID = PatientID;
    this.DoctorID = DoctorID;
    this.endDateTime = endDateTime;
    this.PatientURL = PatientURL;
    this.HostRoomURL = HostRoomURL;
    this.illnessDescription = illnessDescription;
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
          row.endDateTime,
          row.PatientURL,
          row.HostRoomURL,
          row.illnessDescription
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
          result.recordset[0].endDateTime,
          result.recordset[0].PatientURL,
          result.recordset[0].HostRoomURL,
          result.recordset[0].illnessDescription
        )
      : null;
  }

  static async createAppointment(newAppointmentData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Appointment (PatientID, DoctorID, endDateTime, PatientURL, HostRoomURL, illnessDescription) VALUES (@PatientID, @DoctorID, @endDateTime, @PatientURL, @HostRoomURL, @illnessDescription); SELECT SCOPE_IDENTITY() AS AppointmentID;`;

    const request = connection.request();
    request.input("PatientID", newAppointmentData.PatientID);
    request.input("DoctorID", newAppointmentData.DoctorID);
    request.input("endDateTime", newAppointmentData.endDateTime);
    request.input("PatientURL", newAppointmentData.PatientURL);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL);
    request.input("illnessDescription", newAppointmentData.illnessDescription);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getAppointmentById(result.recordset[0].AppointmentID);
  }

  static async updateAppointment(AppointmentID, newAppointmentData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Appointment SET PatientID = @PatientID, DoctorID = @DoctorID, endDateTime = @endDateTime, PatientURL = @PatientURL, HostRoomURL = @HostRoomURL, illnessDescription = @illnessDescription WHERE AppointmentID = @AppointmentID`;

    const request = connection.request();
    request.input("AppointmentID", AppointmentID);
    request.input("PatientID", newAppointmentData.PatientID || null);
    request.input("DoctorID", newAppointmentData.DoctorID || null);
    request.input("endDateTime", newAppointmentData.endDateTime || null);
    request.input("PatientURL", newAppointmentData.PatientURL || null);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL || null);
    request.input(
      "illnessDescription",
      newAppointmentData.illnessDescription || null
    );

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
