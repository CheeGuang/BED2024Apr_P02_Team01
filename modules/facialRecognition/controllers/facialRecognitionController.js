const FacialRecognition = require("../../../models/facialRecognition");

/**
 * Controller to register a new face descriptor.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.register = (req, res) => {
  const { name, descriptor, PatientID, DoctorID } = req.body;
  FacialRecognition.addDescriptor({ name, descriptor, PatientID, DoctorID });
  res.sendStatus(200);
};
/**
 * Controller to update an existing face descriptor.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updateDescriptor = (req, res) => {
  const { name, descriptor, PatientID, DoctorID } = req.body;
  const updated = FacialRecognition.updateDescriptor({
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
};
/**
 * Controller to get all face descriptors.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getDescriptors = (req, res) => {
  res.json(FacialRecognition.getDescriptors());
};
