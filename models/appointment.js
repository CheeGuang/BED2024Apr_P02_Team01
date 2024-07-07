const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration
const EventEmitter = require("events");
class AppointmentEmitter extends EventEmitter {}
const appointmentEmitter = new AppointmentEmitter();
const PDFDocument = require("pdfkit"); // Import the pdfkit library
const path = require("path");
const { google } = require("googleapis"); // Import googleapis library
const passport = require("../auth"); // Import passport

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
   * @param {string} Diagnosis - The diagnosis for the appointment.
   * @param {Date} MCStartDate - The start date of the medical certificate.
   * @param {Date} MCEndDate - The end date of the medical certificate.
   * @param {string} DoctorNotes - Additional notes from the doctor.
   */
  constructor(
    AppointmentID,
    PatientID,
    DoctorID,
    endDateTime,
    PatientURL,
    HostRoomURL,
    IllnessDescription,
    Diagnosis,
    MCStartDate,
    MCEndDate,
    DoctorNotes
  ) {
    this.AppointmentID = AppointmentID; // Assign the appointment ID
    this.PatientID = PatientID; // Assign the patient ID
    this.DoctorID = DoctorID; // Assign the doctor ID
    this.endDateTime = endDateTime; // Assign the end date and time
    this.PatientURL = PatientURL; // Assign the patient URL
    this.HostRoomURL = HostRoomURL; // Assign the host room URL
    this.IllnessDescription = IllnessDescription; // Assign the illness description
    this.Diagnosis = Diagnosis; // Assign the diagnosis
    this.MCStartDate = MCStartDate; // Assign the medical certificate start date
    this.MCEndDate = MCEndDate; // Assign the medical certificate end date
    this.DoctorNotes = DoctorNotes; // Assign the doctor's notes
  }

  /**
   * Get all appointments.
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
   */
  static async getAllAppointments() {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `SELECT * FROM Appointment`; // SQL query to select all appointments
    const request = connection.request(); // Create a request object
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

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
          row.IllnessDescription,
          row.Diagnosis,
          row.MCStartDate,
          row.MCEndDate,
          row.DoctorNotes
        )
    );
  }

  /**
   * Get an appointment by ID.
   * @param {number} AppointmentID - The ID of the appointment.
   * @returns {Promise<Appointment|null>} A promise that resolves to an Appointment object or null if not found.
   */
  static async getAppointmentById(AppointmentID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `SELECT * FROM Appointment WHERE AppointmentID = @AppointmentID`; // SQL query to select an appointment by ID
    const request = connection.request(); // Create a request object
    request.input("AppointmentID", AppointmentID); // Add the input parameter for the query
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

    // Return the result as an Appointment object if found, otherwise return null
    return result.recordset[0]
      ? new Appointment(
          result.recordset[0].AppointmentID,
          result.recordset[0].PatientID,
          result.recordset[0].DoctorID,
          result.recordset[0].endDateTime,
          result.recordset[0].PatientURL,
          result.recordset[0].HostRoomURL,
          result.recordset[0].IllnessDescription,
          result.recordset[0].Diagnosis,
          result.recordset[0].MCStartDate,
          result.recordset[0].MCEndDate,
          result.recordset[0].DoctorNotes
        )
      : null;
  }

  /**
   * Get appointments by patient ID.
   * @param {number} PatientID - The ID of the patient.
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
   */
  static async getAppointmentsByPatientId(PatientID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `SELECT * FROM Appointment WHERE PatientID = @PatientID`; // SQL query to select appointments by patient ID
    const request = connection.request(); // Create a request object
    request.input("PatientID", PatientID); // Add the input parameter for the query
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

    const appointments = result.recordset.map((row) => {
      return new Appointment(
        row.AppointmentID,
        row.PatientID,
        row.DoctorID,
        row.endDateTime,
        row.PatientURL,
        row.HostRoomURL,
        row.IllnessDescription,
        row.Diagnosis,
        row.MCStartDate,
        row.MCEndDate,
        row.DoctorNotes
      );
    });

    console.log(appointments);

    // Map the results to Appointment objects and return them
    return appointments;
  }

  /**
   * Get appointments by doctor ID.
   * @param {number} DoctorID - The ID of the doctor.
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
   */
  static async getAppointmentsByDoctorId(DoctorID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `SELECT * FROM Appointment WHERE DoctorID = @DoctorID`; // SQL query to select appointments by doctor ID
    const request = connection.request(); // Create a request object
    request.input("DoctorID", DoctorID); // Add the input parameter for the query
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

    // Map the results to Appointment objects and return them
    return result.recordset.map((row) => {
      return new Appointment(
        row.AppointmentID,
        row.PatientID,
        row.DoctorID,
        row.endDateTime,
        row.PatientURL,
        row.HostRoomURL,
        row.IllnessDescription,
        row.Diagnosis,
        row.MCStartDate,
        row.MCEndDate,
        row.DoctorNotes
      );
    });
  }

  /**
   * Get unassigned appointments (appointments with no assigned doctor).
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of unassigned Appointment objects.
   */
  static async getUnassignedAppointments() {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `SELECT * FROM Appointment WHERE DoctorID IS NULL`; // SQL query to select unassigned appointments
    const request = connection.request(); // Create a request object
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

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
          row.IllnessDescription,
          row.Diagnosis,
          row.MCStartDate,
          row.MCEndDate,
          row.DoctorNotes
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
   * @param {string} newAppointmentData.Diagnosis - The diagnosis for the appointment.
   * @param {Date} newAppointmentData.MCStartDate - The start date of the medical certificate.
   * @param {Date} newAppointmentData.MCEndDate - The end date of the medical certificate.
   * @param {string} newAppointmentData.DoctorNotes - Additional notes from the doctor.
   * @returns {Promise<Appointment>} A promise that resolves to the created Appointment object.
   */
  static async createAppointment(newAppointmentData) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    // SQL query to insert a new appointment and get the generated AppointmentID
    const sqlQuery = `INSERT INTO Appointment (PatientID, DoctorID, endDateTime, PatientURL, HostRoomURL, IllnessDescription, Diagnosis, MCStartDate, MCEndDate, DoctorNotes) VALUES (@PatientID, @DoctorID, @endDateTime, @PatientURL, @HostRoomURL, @IllnessDescription, @Diagnosis, @MCStartDate, @MCEndDate, @DoctorNotes); SELECT SCOPE_IDENTITY() AS AppointmentID;`;
    const request = connection.request(); // Create a request object
    // Add the input parameters for the query
    request.input("PatientID", newAppointmentData.PatientID);
    request.input("DoctorID", newAppointmentData.DoctorID);
    request.input("endDateTime", newAppointmentData.endDateTime);
    request.input("PatientURL", newAppointmentData.PatientURL);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL);
    request.input("IllnessDescription", newAppointmentData.IllnessDescription);
    request.input("Diagnosis", newAppointmentData.Diagnosis);
    request.input("MCStartDate", newAppointmentData.MCStartDate);
    request.input("MCEndDate", newAppointmentData.MCEndDate);
    request.input("DoctorNotes", newAppointmentData.DoctorNotes);
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return this.getAppointmentById(result.recordset[0].AppointmentID); // Return the newly created appointment by its ID
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
   * @param {string} newAppointmentData.Diagnosis - The diagnosis for the appointment (optional).
   * @param {Date} newAppointmentData.MCStartDate - The start date of the medical certificate (optional).
   * @param {Date} newAppointmentData.MCEndDate - The end date of the medical certificate (optional).
   * @param {string} newAppointmentData.DoctorNotes - Additional notes from the doctor (optional).
   * @returns {Promise<Appointment>} A promise that resolves to the updated Appointment object.
   */
  static async updateAppointment(AppointmentID, newAppointmentData) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    // SQL query to update an appointment by its ID
    const sqlQuery = `UPDATE Appointment SET PatientID = @PatientID, DoctorID = @DoctorID, endDateTime = @endDateTime, PatientURL = @PatientURL, HostRoomURL = @HostRoomURL, IllnessDescription = @IllnessDescription, Diagnosis = @Diagnosis, MCStartDate = @MCStartDate, MCEndDate = @MCEndDate, DoctorNotes = @DoctorNotes WHERE AppointmentID = @AppointmentID`;
    const request = connection.request(); // Create a request object
    // Add the input parameters for the query
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
    request.input("Diagnosis", newAppointmentData.Diagnosis || null);
    request.input("MCStartDate", newAppointmentData.MCStartDate || null);
    request.input("MCEndDate", newAppointmentData.MCEndDate || null);
    request.input("DoctorNotes", newAppointmentData.DoctorNotes || null);
    await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return this.getAppointmentById(AppointmentID); // Return the updated appointment by its ID
  }

  // Google Calendar function
  static async createGoogleCalendarEvent(
    appointmentData,
    accessToken,
    refreshToken
  ) {
    try {
      const { endDateTime } = appointmentData;

      const oauth2Client = new google.auth.OAuth2(
        process.env.googleClientId,
        process.env.googleClientSecret,
        "http://localhost:8000/auth/google/callback" // Adjust according to your setup
      );

      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      console.log(accessToken);
      console.log(refreshToken);
      console.log(eventEndDateTimeObj.toISOString());

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      //allocate 15mins consultation time
      const eventEndDateTimeObj = moment()
        .tz(endDateTime, "Asia/Singapore")
        .add(15, "minutes");

      const event = {
        summary: "SyncHealth Teleconsult",
        start: {
          dateTime: endDateTime,
          timeZone: "Asia/Singapore",
        },
        end: {
          dateTime: eventEndDateTimeObj.toISOString(),
          timeZone: "Asia/Singapore",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 120 },
            { method: "popup", minutes: 60 },
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      console.log("Event created: %s", response.data.htmlLink);
      return response.data.htmlLink;
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
      throw new Error("Error creating Google Calendar event");
    }
  }

  /**
   * Update the doctor ID of an appointment.
   * @param {number} AppointmentID - The ID of the appointment to update.
   * @param {number} DoctorID - The new doctor ID.
   * @returns {Promise<Appointment>} A promise that resolves to the updated Appointment object.
   */
  static async updateDoctorId(AppointmentID, DoctorID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `UPDATE Appointment SET DoctorID = @DoctorID WHERE AppointmentID = @AppointmentID`; // SQL query to update the doctor ID of an appointment by its ID
    const request = connection.request(); // Create a request object
    request.input("AppointmentID", AppointmentID); // Add the input parameter for the query
    request.input("DoctorID", DoctorID); // Add the input parameter for the query
    await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return this.getAppointmentById(AppointmentID); // Return the updated appointment by its ID
  }

  /**
   * Delete an appointment.
   * @param {number} AppointmentID - The ID of the appointment to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the appointment was deleted, otherwise false.
   */
  static async deleteAppointment(AppointmentID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `DELETE FROM Appointment WHERE AppointmentID = @AppointmentID`; // SQL query to delete an appointment by its ID
    const request = connection.request(); // Create a request object
    request.input("AppointmentID", AppointmentID); // Add the input parameter for the query
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return result.rowsAffected > 0; // Return true if the appointment was deleted, otherwise false
  }

  /**
   * Add medicines to an appointment.
   * @param {number} AppointmentID - The ID of the appointment.
   * @param {number[]} MedicineIDs - An array of medicine IDs to add to the appointment.
   * @returns {Promise<void>} A promise that resolves when the medicines are added.
   */
  static async addMedicinesToAppointment(AppointmentID, MedicineIDs) {
    console.log(
      `Starting addMedicinesToAppointment for AppointmentID: ${AppointmentID} with MedicineIDs: ${MedicineIDs}`
    );

    if (!Array.isArray(MedicineIDs)) {
      throw new TypeError("MedicineIDs must be an array");
    }

    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    console.log("Database connection established.");

    try {
      for (const MedicineID of MedicineIDs) {
        const sqlQuery = `INSERT INTO AppointmentMedicine (AppointmentID, MedicineID) VALUES (@AppointmentID, @MedicineID)`;
        const request = connection.request();
        request.input("AppointmentID", AppointmentID);
        request.input("MedicineID", MedicineID);
        console.log(
          `Inserting MedicineID: ${MedicineID} for AppointmentID: ${AppointmentID}`
        );
        await request.query(sqlQuery); // Execute the query for each medicine
      }

      console.log(`Medicines added to AppointmentID: ${AppointmentID}`);
      // Update PatientMedicine table
      await Appointment.updatePatientMedicineTable(AppointmentID);
    } catch (error) {
      console.error(
        `Error in addMedicinesToAppointment for AppointmentID: ${AppointmentID}`,
        error
      );
      throw error;
    } finally {
      connection.close(); // Close the database connection
      console.log("Database connection closed.");
    }
  }

  /**
   * Update the medicines for an appointment.
   * @param {number} AppointmentID - The ID of the appointment.
   * @param {number[]} MedicineIDs - An array of medicine IDs to update for the appointment.
   * @returns {Promise<void>} A promise that resolves when the medicines are updated.
   */
  static async updateMedicinesForAppointment(AppointmentID, MedicineIDs) {
    if (!Array.isArray(MedicineIDs)) {
      throw new TypeError("MedicineIDs must be an array");
    }

    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const request = connection.request(); // Create a request object

    // Start a transaction
    const transaction = new sql.Transaction(connection);
    await transaction.begin();

    try {
      // Delete existing medicines for the appointment
      const deleteQuery = `DELETE FROM AppointmentMedicine WHERE AppointmentID = @AppointmentID`;
      const deleteRequest = transaction.request();
      deleteRequest.input("AppointmentID", AppointmentID);
      await deleteRequest.query(deleteQuery);

      // Add new medicines for the appointment
      for (const MedicineID of MedicineIDs) {
        const insertQuery = `INSERT INTO AppointmentMedicine (AppointmentID, MedicineID) VALUES (@AppointmentID, @MedicineID)`;
        const insertRequest = transaction.request();
        insertRequest.input("AppointmentID", AppointmentID);
        insertRequest.input("MedicineID", MedicineID);
        await insertRequest.query(insertQuery); // Execute the query for each medicine
      }

      await transaction.commit(); // Commit the transaction

      // Update PatientMedicine table
      await Appointment.updatePatientMedicineTable(AppointmentID);
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction on error
      throw error;
    } finally {
      connection.close(); // Close the database connection
    }
  }

  /**
   * Update the PatientMedicine table based on the AppointmentID.
   * @param {number} AppointmentID - The ID of the appointment.
   * @returns {Promise<void>} A promise that resolves when the PatientMedicine table is updated.
   */
  static async updatePatientMedicineTable(AppointmentID) {
    console.log(
      `Starting updatePatientMedicineTable for AppointmentID: ${AppointmentID}`
    );
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    console.log("Database connection established.");

    const request = connection.request(); // Create a request object

    try {
      // Start a transaction
      const transaction = new sql.Transaction(connection);
      await transaction.begin();
      console.log("Transaction started.");

      try {
        // Get the PatientID associated with the AppointmentID using INNER JOIN
        console.log(`Fetching PatientID for AppointmentID: ${AppointmentID}`);
        const patientQuery = `
          SELECT a.PatientID
          FROM Appointment a
          INNER JOIN AppointmentMedicine am ON a.AppointmentID = am.AppointmentID
          WHERE a.AppointmentID = @AppointmentID
        `;
        request.input("AppointmentID", AppointmentID);
        const patientResult = await request.query(patientQuery);
        const PatientID = patientResult.recordset[0].PatientID;
        console.log(
          `Fetched PatientID: ${PatientID} for AppointmentID: ${AppointmentID}`
        );

        // Delete all PatientMedicine records where PatientID = PatientID
        console.log(
          `Deleting all PatientMedicine records for PatientID: ${PatientID}`
        );
        const deleteQuery = `
          DELETE FROM PatientMedicine
          WHERE PatientID = @PatientID
        `;
        const deleteRequest = transaction.request();
        deleteRequest.input("PatientID", PatientID);
        await deleteRequest.query(deleteQuery);
        console.log(
          `Deleted all PatientMedicine records for PatientID: ${PatientID}`
        );

        // Get all unique MedicineIDs associated with the same PatientID in the AppointmentMedicine table using INNER JOIN
        console.log(`Fetching unique MedicineIDs for PatientID: ${PatientID}`);
        const medicineQuery = `
          SELECT DISTINCT am.MedicineID
          FROM AppointmentMedicine am
          INNER JOIN Appointment a ON am.AppointmentID = a.AppointmentID
          WHERE a.PatientID = @PatientID
        `;
        const medicineRequest = transaction.request();
        medicineRequest.input("PatientID", PatientID);
        const medicineResult = await medicineRequest.query(medicineQuery);
        const MedicineIDs = medicineResult.recordset.map(
          (row) => row.MedicineID
        );
        console.log(
          `Fetched unique MedicineIDs: ${MedicineIDs} for PatientID: ${PatientID}`
        );

        // Add all unique MedicineIDs to the PatientMedicine table
        const insertQuery = `
          INSERT INTO PatientMedicine (PatientID, MedicineID)
          VALUES (@PatientID, @MedicineID)
        `;
        for (const MedicineID of MedicineIDs) {
          const insertRequest = transaction.request();
          insertRequest.input("PatientID", PatientID);
          insertRequest.input("MedicineID", MedicineID);
          console.log(
            `Inserting MedicineID: ${MedicineID} for PatientID: ${PatientID}`
          );
          await insertRequest.query(insertQuery);
        }

        await transaction.commit();
        console.log("Transaction committed successfully.");
      } catch (error) {
        await transaction.rollback();
        console.error("Transaction rolled back due to an error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in updatePatientMedicineTable:", error);
      throw error;
    } finally {
      connection.close(); // Close the database connection
      console.log("Database connection closed.");
    }
  }

  /**
   * Get all medicines for an appointment.
   * @param {number} AppointmentID - The ID of the appointment.
   * @returns {Promise<object[]>} A promise that resolves to an array of medicines for the appointment.
   */
  static async getMedicinesForAppointment(AppointmentID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const request = connection.request(); // Create a request object

    try {
      // Get all MedicineIDs associated with the AppointmentID
      const medicineQuery = `
        SELECT m.MedicineID, m.Name, m.Description, m.Price, m.RecommendedDosage, m.Image
        FROM AppointmentMedicine am
        INNER JOIN Medicine m ON am.MedicineID = m.MedicineID
        WHERE am.AppointmentID = @AppointmentID
      `;
      request.input("AppointmentID", AppointmentID);
      const result = await request.query(medicineQuery);
      return result.recordset;
    } catch (error) {
      throw error;
    } finally {
      connection.close(); // Close the database connection
    }
  }

  /**
   * Update an appointment.
   * @param {number} AppointmentID - The ID of the appointment.
   * @param {object} appointmentData - The new data for the appointment.
   * @param {Date} appointmentData.endDateTime - The end date and time of the appointment.
   * @param {string} appointmentData.Diagnosis - The diagnosis for the appointment.
   * @param {Date} appointmentData.MCStartDate - The start date of the medical certificate.
   * @param {Date} appointmentData.MCEndDate - The end date of the medical certificate.
   * @param {string} appointmentData.DoctorNotes - Additional notes from the doctor.
   * @param {number[]} MedicineIDs - An array of medicine IDs to update for the appointment.
   * @returns {Promise<void>} A promise that resolves when the appointment and medicines are updated.
   */
  static async updateAppointmentWithMedicines(
    AppointmentID,
    appointmentData,
    MedicineIDs
  ) {
    console.log(
      `Starting updateAppointmentWithMedicines for AppointmentID: ${AppointmentID} with data: ${JSON.stringify(
        appointmentData
      )} and MedicineIDs: ${MedicineIDs}`
    );

    if (!Array.isArray(MedicineIDs)) {
      console.error("MedicineIDs must be an array");
      throw new TypeError("MedicineIDs must be an array");
    }

    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    console.log("Database connection established.");

    // Start a transaction
    const transaction = new sql.Transaction(connection);
    await transaction.begin();
    console.log("Transaction started.");

    try {
      // Update the appointment details
      console.log(
        `Updating appointment details for AppointmentID: ${AppointmentID}`
      );

      const updateQuery = `
        UPDATE Appointment
        SET Diagnosis = @Diagnosis,
            MCStartDate = @MCStartDate,
            MCEndDate = @MCEndDate,
            DoctorNotes = @DoctorNotes
        WHERE AppointmentID = @AppointmentID
      `;
      const updateRequest = transaction.request();
      updateRequest.input("AppointmentID", AppointmentID);
      updateRequest.input("Diagnosis", appointmentData.Diagnosis);
      updateRequest.input("MCStartDate", appointmentData.MCStartDate);
      updateRequest.input("MCEndDate", appointmentData.MCEndDate);
      updateRequest.input("DoctorNotes", appointmentData.DoctorNotes);
      await updateRequest.query(updateQuery);

      console.log(
        `Updated appointment details for AppointmentID: ${AppointmentID}`
      );

      if (Array.isArray(MedicineIDs)) {
        console.log("MedicineIDs is an array");
      } else {
        console.log("MedicineIDs is not an array");
      }

      // Commit the transaction
      await transaction.commit();
      console.log(`Transaction committed for AppointmentID: ${AppointmentID}`);
    } catch (error) {
      console.error(
        `Error during updateAppointmentWithMedicines for AppointmentID: ${AppointmentID}`,
        error
      );
      await transaction.rollback(); // Rollback the transaction on error
      console.log(
        `Transaction rolled back for AppointmentID: ${AppointmentID}`
      );
      throw error;
    } finally {
      connection.close(); // Close the database connection
      console.log(
        `Database connection closed for AppointmentID: ${AppointmentID}`
      );
    }

    try {
      // Add medicines to the appointment
      await Appointment.updateMedicinesForAppointment(
        AppointmentID,
        MedicineIDs
      );

      // Emit the update event
      console.log(`Emitting update event for AppointmentID: ${AppointmentID}`);
      appointmentEmitter.emit("appointmentUpdated", {
        AppointmentID,
        updatedWithMedicines: true,
      });
    } catch (error) {
      console.error(
        `Error during updateMedicinesForAppointment for AppointmentID: ${AppointmentID}`,
        error
      );
      throw error;
    }
  }

  /**
   * Get appointment details by ID.
   * @param {number} AppointmentID - The ID of the appointment.
   * @returns {Promise<object|null>} A promise that resolves to an object containing appointment details or null if not found.
   */
  static async getAppointmentDetailsById(AppointmentID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `
      SELECT       
        CONCAT(p.GivenName, ' ', p.FamilyName) AS PatientFullName,
        CONCAT('Dr. ', d.GivenName, ' ', d.FamilyName) AS DoctorFullName,
        a.IllnessDescription,
        a.Diagnosis,
        a.MCStartDate,
        a.MCEndDate
      FROM 
        Appointment a
      INNER JOIN 
        Patient p ON a.PatientID = p.PatientID
      INNER JOIN 
        Doctor d ON a.DoctorID = d.DoctorID
      WHERE 
        a.AppointmentID = @AppointmentID
    `; // SQL query to select appointment details with joined patient and doctor information
    const request = connection.request(); // Create a request object
    request.input("AppointmentID", AppointmentID); // Add the input parameter for the query
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

    if (!result.recordset[0]) {
      return null; // Return null if no record is found
    }

    // Ensure null values are returned explicitly
    const appointmentDetails = result.recordset[0];
    return {
      PatientFullName: appointmentDetails.PatientFullName || null,
      DoctorFullName: appointmentDetails.DoctorFullName || null,
      IllnessDescription: appointmentDetails.IllnessDescription || null,
      Diagnosis: appointmentDetails.Diagnosis || null,
      MCStartDate: appointmentDetails.MCStartDate || null,
      MCEndDate: appointmentDetails.MCEndDate || null,
    };
  }

  /**
   * Generate a medical certificate PDF document for the appointment.
   * @param {number} AppointmentID - The ID of the appointment.
   * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the PDF document.
   */
  static async generateMedicalCertificate(AppointmentID) {
    // Get appointment details
    const details = await this.getAppointmentDetailsById(AppointmentID);
    if (!details) {
      throw new Error("Appointment not found");
    }

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {});

    // Add SyncHealth logo
    const logoPath = path.join(
      __dirname,
      "../public/images/SyncHealthLogo.png"
    );
    doc.image(logoPath, { fit: [100, 100], align: "center", valign: "center" });

    // Add title
    doc.fontSize(24).text("Medical Certificate", { align: "center" });
    doc.moveDown(2);

    // Add details
    doc.fontSize(16).text("Patient Details", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Full Name: ${details.PatientFullName || "N/A"}`);
    doc.moveDown();

    doc.fontSize(16).text("Doctor Details", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Full Name: ${details.DoctorFullName || "N/A"}`);
    doc.moveDown();

    doc.fontSize(16).text("Medical Information", { underline: true });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Illness Description: ${details.IllnessDescription || "N/A"}`);
    doc.moveDown();
    doc.fontSize(12).text(`Diagnosis: ${details.Diagnosis || "N/A"}`);
    doc.moveDown();
    doc.fontSize(12).text(`MC Start Date: ${details.MCStartDate || "N/A"}`);
    doc.moveDown();
    doc.fontSize(12).text(`MC End Date: ${details.MCEndDate || "N/A"}`);
    doc.moveDown(2);

    // Add footer
    doc.fontSize(10).text("Generated by SyncHealth", {
      align: "center",
      valign: "bottom",
    });

    // Finalize the PDF and end the stream
    doc.end();

    // Return a promise that resolves to the PDF buffer
    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on("error", reject);
    });
  }
}

module.exports = { Appointment, appointmentEmitter };
