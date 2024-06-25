const sql = require("mssql");
const dbConfig = require("../dbConfig");

/**
 * Class representing an Appointment.
 */
class Appointment {
  /**
   * Create an Appointment.
   * @param {number} AppointmentID - The ID of the appointment.
   * @param {number} PatientID - The ID of the patient.
   * @param {number} DoctorID - The ID of the doctor.
   * @param {Date} endDateTime - The end date and time of the appointment.
   * @param {string} PatientURL - The URL for the patient's appointment.
   * @param {string} HostRoomURL - The URL for the host's room.
   * @param {string} IllnessDescription - The description of the patient's illness.
   */
  constructor(
    AppointmentID,
    PatientID,
    DoctorID,
    endDateTime,
    PatientURL,
    HostRoomURL,
    IllnessDescription
  ) {
    this.AppointmentID = AppointmentID;
    this.PatientID = PatientID;
    this.DoctorID = DoctorID;
    this.endDateTime = endDateTime;
    this.PatientURL = PatientURL;
    this.HostRoomURL = HostRoomURL;
    this.IllnessDescription = IllnessDescription;
  }

  /**
   * Get all appointments.
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
   */
  static async getAllAppointments() {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to select all appointments
    const sqlQuery = `SELECT * FROM Appointment`;

    // Create a request object
    const request = connection.request();

    // Execute the query
    const result = await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Map the results to Appointment objects and return them
    return result.recordset.map(
      (row) =>
        new Appointment(
          row.AppointmentID,
          row.PatientID,
          row.DoctorID,
          row.endDateTime,
          row.PatientURL,
          row.HostRoomURL,
          row.IllnessDescription
        )
    );
  }

  /**
   * Get an appointment by ID.
   * @param {number} AppointmentID - The ID of the appointment.
   * @returns {Promise<Appointment|null>} A promise that resolves to an Appointment object or null if not found.
   */
  static async getAppointmentById(AppointmentID) {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to select an appointment by ID
    const sqlQuery = `SELECT * FROM Appointment WHERE AppointmentID = @AppointmentID`;

    // Create a request object and add the input parameter
    const request = connection.request();
    request.input("AppointmentID", AppointmentID);

    // Execute the query
    const result = await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Return the result as an Appointment object if found, otherwise return null
    return result.recordset[0]
      ? new Appointment(
          result.recordset[0].AppointmentID,
          result.recordset[0].PatientID,
          result.recordset[0].DoctorID,
          result.recordset[0].endDateTime,
          result.recordset[0].PatientURL,
          result.recordset[0].HostRoomURL,
          result.recordset[0].IllnessDescription
        )
      : null;
  }

  /**
   * Get appointments by patient ID.
   * @param {number} PatientID - The ID of the patient.
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
   */
  static async getAppointmentsByPatientId(PatientID) {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to select appointments by patient ID
    const sqlQuery = `SELECT * FROM Appointment WHERE PatientID = @PatientID`;

    // Create a request object and add the input parameter
    const request = connection.request();
    request.input("PatientID", PatientID);

    // Execute the query
    const result = await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Return the result as an array of Appointment objects
    return result.recordsets[0];
  }

  /**
   * Get appointments by doctor ID.
   * @param {number} DoctorID - The ID of the doctor.
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
   */
  static async getAppointmentsByDoctorId(DoctorID) {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to select appointments by doctor ID
    const sqlQuery = `SELECT * FROM Appointment WHERE DoctorID = @DoctorID`;

    // Create a request object and add the input parameter
    const request = connection.request();
    request.input("DoctorID", DoctorID);

    // Execute the query
    const result = await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Return the result as an array of Appointment objects
    return result.recordsets[0];
  }

  /**
   * Get unassigned appointments (appointments with no assigned doctor).
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of unassigned Appointment objects.
   */
  static async getUnassignedAppointments() {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to select unassigned appointments
    const sqlQuery = `SELECT * FROM Appointment WHERE DoctorID IS NULL`;

    // Create a request object
    const request = connection.request();

    // Execute the query
    const result = await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Map the results to Appointment objects and return them
    return result.recordset.map(
      (row) =>
        new Appointment(
          row.AppointmentID,
          row.PatientID,
          row.DoctorID,
          row.endDateTime,
          row.PatientURL,
          row.HostRoomURL,
          row.IllnessDescription
        )
    );
  }

  /**
   * Create a new appointment.
   * @param {object} newAppointmentData - The data for the new appointment.
   * @param {number} newAppointmentData.PatientID - The ID of the patient.
   * @param {number} newAppointmentData.DoctorID - The ID of the doctor.
   * @param {Date} newAppointmentData.endDateTime - The end date and time of the appointment.
   * @param {string} newAppointmentData.PatientURL - The URL for the patient's appointment.
   * @param {string} newAppointmentData.HostRoomURL - The URL for the host's room.
   * @param {string} newAppointmentData.IllnessDescription - The description of the patient's illness.
   * @returns {Promise<Appointment>} A promise that resolves to the created Appointment object.
   */
  static async createAppointment(newAppointmentData) {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to insert a new appointment and get the generated AppointmentID
    const sqlQuery = `INSERT INTO Appointment (PatientID, DoctorID, endDateTime, PatientURL, HostRoomURL, IllnessDescription) VALUES (@PatientID, @DoctorID, @endDateTime, @PatientURL, @HostRoomURL, @IllnessDescription); SELECT SCOPE_IDENTITY() AS AppointmentID;`;

    // Create a request object and add the input parameters
    const request = connection.request();
    request.input("PatientID", newAppointmentData.PatientID);
    request.input("DoctorID", newAppointmentData.DoctorID);
    request.input("endDateTime", newAppointmentData.endDateTime);
    request.input("PatientURL", newAppointmentData.PatientURL);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL);
    request.input("IllnessDescription", newAppointmentData.IllnessDescription);

    // Execute the query
    const result = await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Return the newly created appointment by its ID
    return this.getAppointmentById(result.recordset[0].AppointmentID);
  }

  /**
   * Update an appointment.
   * @param {number} AppointmentID - The ID of the appointment to update.
   * @param {object} newAppointmentData - The new data for the appointment.
   * @param {number} newAppointmentData.PatientID - The ID of the patient (optional).
   * @param {number} newAppointmentData.DoctorID - The ID of the doctor (optional).
   * @param {Date} newAppointmentData.endDateTime - The end date and time of the appointment (optional).
   * @param {string} newAppointmentData.PatientURL - The URL for the patient's appointment (optional).
   * @param {string} newAppointmentData.HostRoomURL - The URL for the host's room (optional).
   * @param {string} newAppointmentData.IllnessDescription - The description of the patient's illness (optional).
   * @returns {Promise<Appointment>} A promise that resolves to the updated Appointment object.
   */
  static async updateAppointment(AppointmentID, newAppointmentData) {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to update an appointment by its ID
    const sqlQuery = `UPDATE Appointment SET PatientID = @PatientID, DoctorID = @DoctorID, endDateTime = @endDateTime, PatientURL = @PatientURL, HostRoomURL = @HostRoomURL, IllnessDescription = @IllnessDescription WHERE AppointmentID = @AppointmentID`;

    // Create a request object and add the input parameters
    const request = connection.request();
    request.input("AppointmentID", AppointmentID);
    request.input("PatientID", newAppointmentData.PatientID || null);
    request.input("DoctorID", newAppointmentData.DoctorID || null);
    request.input("endDateTime", newAppointmentData.endDateTime || null);
    request.input("PatientURL", newAppointmentData.PatientURL || null);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL || null);
    request.input(
      "IllnessDescription",
      newAppointmentData.IllnessDescription || null
    );

    // Execute the query
    await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Return the updated appointment by its ID
    return this.getAppointmentById(AppointmentID);
  }

  /**
   * Update the doctor ID of an appointment.
   * @param {number} AppointmentID - The ID of the appointment to update.
   * @param {number} DoctorID - The new doctor ID.
   * @returns {Promise<Appointment>} A promise that resolves to the updated Appointment object.
   */
  static async updateDoctorId(AppointmentID, DoctorID) {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to update the doctor ID of an appointment by its ID
    const sqlQuery = `UPDATE Appointment SET DoctorID = @DoctorID WHERE AppointmentID = @AppointmentID`;

    // Create a request object and add the input parameters
    const request = connection.request();
    request.input("AppointmentID", AppointmentID);
    request.input("DoctorID", DoctorID);

    // Execute the query
    await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Return the updated appointment by its ID
    return this.getAppointmentById(AppointmentID);
  }

  /**
   * Delete an appointment.
   * @param {number} AppointmentID - The ID of the appointment to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the appointment was deleted, otherwise false.
   */
  static async deleteAppointment(AppointmentID) {
    // Establish a connection to the database
    const connection = await sql.connect(dbConfig);

    // SQL query to delete an appointment by its ID
    const sqlQuery = `DELETE FROM Appointment WHERE AppointmentID = @AppointmentID`;

    // Create a request object and add the input parameter
    const request = connection.request();
    request.input("AppointmentID", AppointmentID);

    // Execute the query
    const result = await request.query(sqlQuery);

    // Close the database connection
    connection.close();

    // Return true if the appointment was deleted, otherwise false
    return result.rowsAffected > 0;
  }
}

module.exports = Appointment;
