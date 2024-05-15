// ========== Packages ==========
// Initialising Path Package
const path = require("path");
// Initialising Cross Fetch Package for handling HTTP Request
const axios = require("cross-fetch");
// Initialising Moment Time Package for handling date/time manipulation
const moment = require("moment-timezone");

// ========== API Key ==========
const API_KEY = process.env.appointmentAPIKey;

// ========== createAppointment() Logic ==========
const createAppointment = async (req, res) => {
  // Response Content
  try {
    const apiUrl = "https://api.whereby.dev/v1/meetings";

    // Extracting end date time from the request body
    const { endDate } = req.body;

    // Parsing and formatting end date time to ensure it's in ISO 8601 format
    const formattedEndDate = moment(endDate).toISOString();

    // Convert end date time from Singapore Time to the desired timezone
    const endDateTimeUTC = moment.tz(formattedEndDate, "Asia/Singapore").utc();

    // Ensure that End Date Time of meeting is no earlier than 59 minutes from now
    const oneHourFromNow = moment().add(59, "minutes");

    if (endDateTimeUTC.isBefore(oneHourFromNow)) {
      throw new Error("End time must be at least 1 hour away from now.");
    }

    // Ensure that End Date Time of meeting is within one week from now
    const oneWeekFromNow = moment().add(7, "days");

    if (endDateTimeUTC.isAfter(oneWeekFromNow)) {
      throw new Error("End time must be within 1 week from now.");
    }

    // Request data for creating appointment
    const requestData = {
      endDate: endDateTimeUTC, // Using converted end date time in UTC format
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

    // Handling Response
    res.status(200).json({
      status: "Success",
      message: "Expense added successfully",
      roomURL: roomData.roomUrl,
      hostRoomUrl: roomData.hostRoomUrl,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ status: "Failed!", error: error.message });
  }
};

// ========== Export ==========
module.exports = createAppointment;
