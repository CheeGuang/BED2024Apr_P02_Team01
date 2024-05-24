const Patient = require("../../../models/patient.js");

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.getAllPatients();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving patients");
  }
};

const getPatientById = async (req, res) => {
  const patientId = parseInt(req.params.id);
  try {
    const patient = await Patient.getPatientById(patientId);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving patient");
  }
};

const createPatient = async (req, res) => {
  const newPatient = req.body;
  try {
    const createdPatient = await Patient.createPatient(newPatient);
    res.status(201).json(createdPatient);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating patient");
  }
};

const updatePatient = async (req, res) => {
  const patientId = parseInt(req.params.id);
  const newPatientData = req.body;

  try {
    const updatedPatient = await Patient.updatePatient(
      patientId,
      newPatientData
    );
    if (!updatedPatient) {
      return res.status(404).send("Patient not found");
    }
    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating patient");
  }
};

const deletePatient = async (req, res) => {
  const patientId = parseInt(req.params.id);

  try {
    const success = await Patient.deletePatient(patientId);
    if (!success) {
      return res.status(404).send("Patient not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting patient");
  }
};

const searchPatients = async (req, res) => {
  const searchTerm = req.query.searchTerm; // Extract search term from query params
  try {
    const patients = await Patient.searchPatients(searchTerm);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching patients" });
  }
};

module.exports = {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
};
