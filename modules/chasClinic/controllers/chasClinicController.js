const ChasClinic = require("../../../models/chasClinic");

const getMapApiKey = async (req, res) => {
  console.log("HEHHE");
  try {
    const apiKey = await ChasClinic.getMapApiKey();
    res.status(200).json({ apiKey });
  } catch (error) {
    res.status(401).json({ error: "Error getting API Key" });
  }
};

const downloadChasClinics = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    await ChasClinic.downloadFile();
    res.status(200).json({ message: "File downloaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to download file" });
  }
};

const getRandomClinics = async (req, res) => {
  try {
    const clinics = await ChasClinic.getRandomClinics();
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve clinics" });
  }
};

const getNearestClinics = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const clinics = await ChasClinic.getNearestClinics(
      parseFloat(lat),
      parseFloat(lng)
    );
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve clinics" });
  }
};

const getClinicsInBounds = async (req, res) => {
  try {
    const { north, south, east, west, centerLat, centerLng } = req.query;
    const bounds = {
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
      center: { lat: parseFloat(centerLat), lng: parseFloat(centerLng) },
    };
    const clinics = await ChasClinic.getClinicsInBounds(bounds);
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve clinics" });
  }
};

module.exports = {
  getMapApiKey,
  downloadChasClinics,
  getRandomClinics,
  getNearestClinics,
  getClinicsInBounds,
};
