const Map = require("../../../models/chasClinic");

const getMapApiKey = async (req, res) => {
  try {
    const apiKey = await Map.getMapApiKey();
    res.status(200).json({
      status: "Success",
      apiKey,
    });
  } catch (error) {
    console.error("Error retrieving map API key:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

module.exports = {
  getMapApiKey,
};
