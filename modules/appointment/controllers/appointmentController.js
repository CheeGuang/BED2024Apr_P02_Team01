const moment = require("moment-timezone");
const {
  Appointment,
  appointmentEmitter,
} = require("../../../models/appointment");
const API_KEY = process.env.appointmentAPIKey;
const Patient = require("../../../models/patient");
const Doctor = require("../../../models/doctor");
const { sendEmail, sendEmailWithAttachment } = require("../../../models/email");

/**
 * Controller to create a new appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const createAppointment = async (req, res) => {
  try {
    const apiUrl = "https://api.whereby.dev/v1/meetings";
    const { startDate, endDate, illnessDescription, PatientID } = req.body;

    console.log(illnessDescription);

    // Parsing the start and end dates to moment objects
    const startDateTime = moment.tz(startDate, "Asia/Singapore");
    const endDateTime = moment.tz(endDate, "Asia/Singapore");

    // Ensure that Start Date Time is no earlier than now
    const now = moment().tz("Asia/Singapore").subtract(1, "minute");

    console.log(startDateTime);
    console.log(now);

    if (startDateTime.isBefore(now)) {
      throw new Error("Start time must be in the future.");
    }

    // Ensure that End Date Time of meeting is no earlier than 59 minutes from now
    const oneHourFromNow = moment().tz("Asia/Singapore").add(59, "minutes");
    if (endDateTime.isBefore(oneHourFromNow)) {
      throw new Error("End time must be at least 1 hour away from now.");
    }

    // Ensure that End Date Time of meeting is within one week from now
    const oneWeekFromNow = moment().tz("Asia/Singapore").add(7, "days");
    if (endDateTime.isAfter(oneWeekFromNow)) {
      throw new Error("End time must be within 1 week from now.");
    }

    // Request data for creating appointment
    const requestData = {
      startDate: startDateTime.utc().format(), // Using converted start date time in UTC format
      endDate: endDateTime.utc().format(), // Using converted end date time in UTC format
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
      startDateTime: startDateTime.toISOString(), // Use the formatted Singapore date-time string for start date
      endDateTime: endDateTime.toISOString(), // Use the formatted Singapore date-time string for end date
      PatientURL: roomData.roomUrl,
      HostRoomURL: roomData.hostRoomUrl,
      IllnessDescription: illnessDescription,
    };

    try {
      const createdAppointment = await Appointment.createAppointment(
        newAppointmentData
      );
      // Get Patient Name
      const patient = await Patient.getPatientById(
        newAppointmentData.PatientID
      );
      // Create a confirmation Email

      // Convert endDateTime to local time by adding 7 hours
      const appointmentEndDateTime = new Date(newAppointmentData.endDateTime);
      appointmentEndDateTime.setHours(appointmentEndDateTime.getHours() + 7);

      // Format the new local time as a string
      const localEndDateTime = appointmentEndDateTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const emailData = {
        recipients: patient.Email,
        subject: "Appointment Confirmation",
        text: `Dear ${patient.givenName} ${patient.familyName},\n\nYou have booked an appointment on ${localEndDateTime} successfully.\n\nBest regards,\nSyncHealth Team`,
      };
      await sendEmail(emailData)
        .then((result) => {
          console.log("Booking Confirmation Email sent!");
        })
        .catch((error) => {
          console.error("Error sending booking confirmation email: " + error);
        });
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

/**
 * Controller to add medicines to an appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const addMedicinesToAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { MedicineIDs } = req.body;

  if (!Array.isArray(MedicineIDs)) {
    return res.status(400).json({
      status: "Failed",
      message: "MedicineIDs must be an array",
    });
  }

  try {
    await Appointment.addMedicinesToAppointment(appointmentId, MedicineIDs);
    res.status(200).json({
      status: "Success",
      message: "Medicines added successfully to the appointment",
    });
  } catch (error) {
    console.error("Error adding medicines to appointment:", error);
    res.status(500).send("Error adding medicines to appointment");
  }
};

/**
 * Controller to update the medicines for an appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updateMedicinesForAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { MedicineIDs } = req.body;

  if (!Array.isArray(MedicineIDs)) {
    return res.status(400).json({
      status: "Failed",
      message: "MedicineIDs must be an array",
    });
  }

  try {
    await Appointment.updateMedicinesForAppointment(appointmentId, MedicineIDs);
    res.status(200).json({
      status: "Success",
      message: "Medicines updated successfully for the appointment",
    });
  } catch (error) {
    console.error("Error updating medicines for appointment:", error);
    res.status(500).send("Error updating medicines for appointment");
  }
};

/**
 * Controller to get all medicines for an appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getMedicinesForAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);

  try {
    const medicines = await Appointment.getMedicinesForAppointment(
      appointmentId
    );
    if (medicines.length === 0) {
      return res.status(404).send("No medicines found for this appointment");
    }
    res.json(medicines);
  } catch (error) {
    console.error("Error retrieving medicines for appointment:", error);
    res.status(500).send("Error retrieving medicines for appointment");
  }
};

/**
 * Controller to update an appointment with medicines.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updateAppointmentWithMedicines = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { Diagnosis, MCStartDate, MCEndDate, DoctorNotes, MedicineIDs } =
    req.body;

  if (!Array.isArray(MedicineIDs)) {
    return res.status(400).json({
      status: "Failed",
      message: "MedicineIDs must be an array",
    });
  }

  try {
    await Appointment.updateAppointmentWithMedicines(
      appointmentId,
      { Diagnosis, MCStartDate, MCEndDate, DoctorNotes },
      MedicineIDs
    );
    res.status(200).json({
      status: "Success",
      message: "Appointment and medicines updated successfully",
    });
  } catch (error) {
    console.error("Error updating appointment with medicines:", error);
    res.status(500).send("Error updating appointment with medicines");
  }
};

/**
 * Controller to get appointment details by ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAppointmentDetailsById = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  try {
    const appointmentDetails = await Appointment.getAppointmentDetailsById(
      appointmentId
    );
    if (!appointmentDetails) {
      return res.status(404).send("Appointment not found");
    }
    res.json(appointmentDetails);
  } catch (error) {
    console.error("Error retrieving appointment details:", error);
    res.status(500).send("Error retrieving appointment details");
  }
};

const handleSSEUpdates = (req, res) => {
  const appointmentId = req.params.id;
  console.log(
    `SSE connection established for appointment ID: ${appointmentId}`
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onUpdate = (data) => {
    if (data.AppointmentID == appointmentId) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  appointmentEmitter.on("appointmentUpdated", onUpdate);

  req.on("close", () => {
    appointmentEmitter.removeListener("appointmentUpdated", onUpdate);
    console.log(`SSE connection closed for appointment ID: ${appointmentId}`);
  });
};

/**
 * Controller to generate a medical certificate for an appointment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const generateMedicalCertificate = async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  try {
    const pdfBuffer = await Appointment.generateMedicalCertificate(
      appointmentId
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=SyncHealth-Medical-Certificate.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating medical certificate PDF:", error);
    res.status(500).send("Error generating medical certificate");
  }
};

/**
 * Controller to send a medical certificate via email
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const emailMedicalCertificate = async (req, res) => {
  // Function to send an Email
  const composeEmail = async (appointmentId, pdfBuffer) => {
    try {
      // Get the appointmentInfo
      const appointment = await Appointment.getAppointmentById(appointmentId);
      // Get patient and doctor names
      const patient = await Patient.getPatientById(appointment.PatientID);
      const doctor = await Doctor.getDoctorById(appointment.DoctorID);

      // Create the email
      const emailData = {
        receipients: patient.Email,
        subject: "Medical Certificate",
        text: `Dear ${patient.givenName} ${patient.familyName},\n\nPlease find attached your medical certificate from Dr. ${doctor.familyName}.\n\nBest regards,\nSyncHealth Team`,
        attachments: [
          {
            filename: "SyncHealth-Medical-Certificate.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };
      await sendEmailWithAttachment(emailData);
    } catch (error) {
      console.error("Error sending medical certificate PDF:", error);
    }
  };

  // Generate the MC
  const appointmentId = parseInt(req.params.id);
  try {
    const pdfBuffer = await Appointment.generateMedicalCertificate(
      appointmentId
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=SyncHealth-Medical-Certificate.pdf`
    );
    await composeEmail(appointmentId, pdfBuffer);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating medical certificate PDF:", error);
    res.status(500).send("Error generating medical certificate");
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
  addMedicinesToAppointment,
  updateMedicinesForAppointment,
  getMedicinesForAppointment,
  updateAppointmentWithMedicines,
  getAppointmentDetailsById,
  handleSSEUpdates,
  generateMedicalCertificate,
  emailMedicalCertificate,
};
