const FacialRecognition = require("../../../models/facialRecognition");

/**
 * Controller to register a new face descriptor.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const register = async (req, res) => {
  try {
    const { name, descriptor, PatientID, DoctorID } = req.body;
    await FacialRecognition.addDescriptor({
      name,
      descriptor,
      PatientID,
      DoctorID,
    });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error registering face descriptor:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

/**
 * Controller to update an existing face descriptor.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateDescriptor = async (req, res) => {
  try {
    const { name, descriptor, PatientID, DoctorID } = req.body;
    const updated = await FacialRecognition.updateDescriptor({
      name,
      descriptor,
      PatientID,
      DoctorID,
    });
    if (updated) {
      res.sendStatus(200);
    } else {
      res.status(404).send("Descriptor not found");
    }
  } catch (error) {
    console.error("Error updating face descriptor:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

/**
 * Controller to delete a face descriptor.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteDescriptor = async (req, res) => {
  try {
    const { PatientID, DoctorID } = req.body;
    const deleted = await FacialRecognition.deleteDescriptor({
      PatientID,
      DoctorID,
    });
    if (deleted) {
      res.sendStatus(200);
    } else {
      res.status(404).send("Descriptor not found");
    }
  } catch (error) {
    console.error("Error deleting face descriptor:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

/**
 * Controller to get all face descriptors.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getDescriptors = async (req, res) => {
  try {
    const descriptors = await FacialRecognition.getDescriptors();
    res.json(descriptors);
  } catch (error) {
    console.error("Error fetching face descriptors:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

module.exports = {
  register,
  updateDescriptor,
  deleteDescriptor,
  getDescriptors,
};
