// ========== Packages ==========
// Initializing Moment Time Package for handling date/time manipulation
const moment = require("moment-timezone");
// Appointment Model Configuration
const Appointment = require("../../../models/appointment.js");

// ========== API Key ==========
const API_KEY = process.env.appointmentAPIKey;

/**
 * Controller to create a new appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const createAppointment = async (req, res) => {
  try {
    const apiUrl = "https://api.whereby.dev/v1/meetings";
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

    // Fetch the response from the API
    const roomData = await getResponse().then(async (res) => {
      console.log("Status code:", res.status);
      const data = await res.json();
      console.log("Room URL:", data.roomUrl);
      console.log("Host room URL:", data.hostRoomUrl);
      return data;
    });

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

/**
 * Controller to get all unassigned appointments (appointments with no assigned doctor).
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getUnassignedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getUnassignedAppointments();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointments");
  }
};

/**
 * Controller to get all appointments.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointments");
  }
};

/**
 * Controller to get an appointment by ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAppointmentById = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  try {
    const appointment = await Appointment.getAppointmentById(appointmentId);
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointment");
  }
};

/**
 * Controller to get appointments by patient ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAppointmentsByPatientId = async (req, res) => {
  const patientId = parseInt(req.params.id);
  try {
    const appointments = await Appointment.getAppointmentsByPatientId(
      patientId
    );
    if (!appointments) {
      return res.status(404).send("Appointment not found");
    }
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointments");
  }
};

/**
 * Controller to get appointments by doctor ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAppointmentsByDoctorId = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  try {
    const appointments = await Appointment.getAppointmentsByDoctorId(doctorId);
    if (!appointments) {
      return res.status(404).send("Appointment not found");
    }
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointments");
  }
};

/**
 * Controller to update an appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updateAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const newAppointmentData = req.body;

  try {
    const updatedAppointment = await Appointment.updateAppointment(
      appointmentId,
      newAppointmentData
    );
    if (!updatedAppointment) {
      return res.status(404).send("Appointment not found");
    }
    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating appointment");
  }
};

/**
 * Controller to delete an appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const deleteAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);

  try {
    const success = await Appointment.deleteAppointment(appointmentId);
    if (!success) {
      return res.status(404).send("Appointment not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting appointment");
  }
};

/**
 * Controller to update the doctor ID for an appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updateDoctorId = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const doctorId = req.body.DoctorID;

  try {
    const updatedAppointment = await Appointment.updateDoctorId(
      appointmentId,
      doctorId
    );
    if (!updatedAppointment) {
      return res.status(404).send("Appointment not found");
    }
    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating doctor ID for appointment");
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateDoctorId,
  getUnassignedAppointments,
};
