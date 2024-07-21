const HealthcareIcon = require("../../../models/healthCareIcon");

const getRandomIcons = async (req, res) => {
  try {
    const icons = await HealthcareIcon.getRandomIcons();
    res.status(200).json(icons);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve icons" });
  }
};

module.exports = {
  getRandomIcons,
};
