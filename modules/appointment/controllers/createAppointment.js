// ========== Packages ==========
// Initialising Path Package
const path = require("path");
// Initialising Cross Fetch Package for handling HTTP Request
const axios = require("cross-fetch");
// Initialising Moment Time Package for handling date/time manipulation
const moment = require("moment-timezone");
// Initialising MSSQL Package for database interaction
const sql = require("mssql");
// Database Configuration
const dbConfig = require("../../../dbConfig");
// Appointment Model Configuration
const Appointment = require("../../../models/appointment");

// ========== API Key ==========
const API_KEY = process.env.appointmentAPIKey;

// ========== createAppointment() Logic ==========
const createAppointment = async (req, res) => {
  // Response Content
  try {
    const apiUrl = "https://api.whereby.dev/v1/meetings";

    // Extracting end date time from the request body
    const { endDate, illnessDescription, PatientID } = req.body;

    console.log(illnessDescription);
    // Parsing and formatting end date time to ensure it's in ISO 8601 format
    const formattedEndDate = moment.tz(endDate, "Asia/Singapore").toISOString();

    // Ensure that End Date Time of meeting is no earlier than 59 minutes from now
    const oneHourFromNow = moment().tz("Asia/Singapore").add(59, "minutes");

    if (moment(formattedEndDate).isBefore(oneHourFromNow)) {
      throw new Error("End time must be at least 1 hour away from now.");
    }

    // Ensure that End Date Time of meeting is within one week from now
    const oneWeekFromNow = moment().tz("Asia/Singapore").add(7, "days");

    if (moment(formattedEndDate).isAfter(oneWeekFromNow)) {
      throw new Error("End time must be within 1 week from now.");
    }

    // Request data for creating appointment
    const requestData = {
      endDate: moment(formattedEndDate).utc().format(), // Using converted end date time in UTC format
      fields: ["hostRoomUrl"],
    };

    console.log(requestData);
    // Making POST request to Whereby API
    function getResponse() {
      return fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
    }

    // prettier-ignore
    const roomData = await getResponse().then(async res => {
        console.log("Status code:", res.status);
        const data = await res.json();
        console.log("Room URL:", data.roomUrl);
        console.log("Host room URL:", data.hostRoomUrl);
          return data
      }
    );

    // Ensure that room is created
    if (!roomData.roomUrl || !roomData.hostRoomUrl)
      throw new Error("Unable to create Room.");

    // Post room data into Appointment Table in SQL Database
    const newAppointmentData = {
      PatientID: PatientID,
      endDateTime: formattedEndDate, // Use the formatted Singapore date-time string
      PatientURL: roomData.roomUrl,
      HostRoomURL: roomData.hostRoomUrl,
      IllnessDescription: illnessDescription,
    };

    try {
      const createdAppointment = await Appointment.createAppointment(
        newAppointmentData
      );
      // Handling Response
      res.status(200).json({
        status: "Success",
        message: "Appointment added successfully",
        roomURL: createdAppointment.roomUrl,
        hostRoomUrl: createdAppointment.hostRoomUrl,
      });
    } catch (error) {
      console.error("Error saving appointment to database:", error);
      res.status(500).send("Error creating appointment in the database");
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ status: "Failed!", error: error.message });
  }
};

// ========== Export ==========
module.exports = createAppointment;
