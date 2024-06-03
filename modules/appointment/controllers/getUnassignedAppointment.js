const Appointment = require("../../../models/appointment.js");

const getUnassignedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getUnassignedAppointments();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointments");
  }
};

module.exports = getUnassignedAppointments;
