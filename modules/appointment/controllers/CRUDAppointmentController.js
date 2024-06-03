const Appointment = require("../../../models/appointment.js");

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

const getAppointmentsByPatientId = async (req, res) => {
  console.log("getAppointmentsByPatientId() Called at Controller");
  const patientId = parseInt(req.params.id);
  try {
    const appointment = await Appointment.getAppointmentsByPatientId(patientId);
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointment");
  }
};

const createAppointment = async (req, res) => {
  const newAppointment = req.body;
  try {
    const createdAppointment = await Appointment.createAppointment(
      newAppointment
    );
    res.status(201).json(createdAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating appointment");
  }
};

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

module.exports = {
  createAppointment,
  getAppointmentsByPatientId,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
