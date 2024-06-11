const Medicine = require("../../../models/medicine.js");

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.getAllMedicines();
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving medicines");
  }
};

const getMedicineById = async (req, res) => {
  const medicineId = parseInt(req.params.id);
  try {
    const medicine = await Medicine.getMedicineById(medicineId);
    if (!medicine) {
      return res.status(404).send("Medicine not found");
    }
    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving medicine");
  }
};

const getMedicinesByPatientId = async (req, res) => {
  const patientId = parseInt(req.params.patientId);
  try {
    const medicines = await Medicine.getMedicinesByPatientId(patientId);
    if (medicines.length === 0) {
      return res.status(404).send("No medicines found for this patient");
    }
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving medicines for patient");
  }
};

const createMedicine = async (req, res) => {
  const newMedicine = req.body;
  try {
    const createdMedicine = await Medicine.createMedicine(newMedicine);
    res.status(201).json(createdMedicine);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating medicine");
  }
};

const updateMedicine = async (req, res) => {
  const medicineId = parseInt(req.params.id);
  const newMedicineData = req.body;

  try {
    const updatedMedicine = await Medicine.updateMedicine(
      medicineId,
      newMedicineData
    );
    if (!updatedMedicine) {
      return res.status(404).send("Medicine not found");
    }
    res.json(updatedMedicine);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating medicine");
  }
};

const deleteMedicine = async (req, res) => {
  const medicineId = parseInt(req.params.id);

  try {
    const success = await Medicine.deleteMedicine(medicineId);
    if (!success) {
      return res.status(404).send("Medicine not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting medicine");
  }
};

module.exports = {
  getAllMedicines,
  createMedicine,
  getMedicineById,
  getMedicinesByPatientId,
  updateMedicine,
  deleteMedicine,
};
