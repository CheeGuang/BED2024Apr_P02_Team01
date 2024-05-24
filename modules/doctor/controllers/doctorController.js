const Doctor = require("../../../models/doctor.js");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving doctors");
  }
};

const getDoctorById = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  try {
    const doctor = await Doctor.getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving doctor");
  }
};

const createDoctor = async (req, res) => {
  const newDoctor = req.body;
  try {
    const createdDoctor = await Doctor.createDoctor(newDoctor);
    res.status(201).json(createdDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating doctor");
  }
};

const updateDoctor = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const newDoctorData = req.body;

  try {
    const updatedDoctor = await Doctor.updateDoctor(doctorId, newDoctorData);
    if (!updatedDoctor) {
      return res.status(404).send("Doctor not found");
    }
    res.json(updatedDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating doctor");
  }
};

const deleteDoctor = async (req, res) => {
  const doctorId = parseInt(req.params.id);

  try {
    const success = await Doctor.deleteDoctor(doctorId);
    if (!success) {
      return res.status(404).send("Doctor not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting doctor");
  }
};

module.exports = {
  getAllDoctors,
  createDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
