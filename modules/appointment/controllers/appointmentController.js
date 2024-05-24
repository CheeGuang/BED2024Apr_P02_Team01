const Appointment = require("../../../models/appointment.js");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointments");
  }
};

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
  getAllAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
