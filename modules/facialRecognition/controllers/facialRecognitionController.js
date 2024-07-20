const FacialRecognition = require("../../../models/facialRecognition");

/**
 * Controller to register a new face descriptor.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.register = (req, res) => {
  const { name, descriptor } = req.body;
  FacialRecognition.addDescriptor({ name, descriptor });
  res.sendStatus(200);
};

/**
 * Controller to get all face descriptors.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getDescriptors = (req, res) => {
  res.json(FacialRecognition.getDescriptors());
};
