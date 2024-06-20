const Doctor = require("../../../models/doctor.js");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.googleId);

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

const googleLogin = async (req, res) => {
  console.log("googleLogin Function Called");
  const { token } = req.body;
  console.log("Received token:", token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.googleId,
    });

    console.log("Ticket verified");

    const { sub, email, given_name, family_name, picture } =
      ticket.getPayload();
    console.log("Payload received:", {
      sub,
      email,
      given_name,
      family_name,
      picture,
    });

    const userData = {
      googleId: sub,
      Email: email,
      ContactNumber: null, // Fill in as necessary
      DOB: null, // Fill in as necessary
      Gender: null, // Fill in as necessary
      Profession: null, // Fill in as necessary
      resetPasswordCode: null, // Default value
      givenName: given_name,
      familyName: family_name,
      profilePicture: picture, // Updated field name
    };

    console.log("User data constructed:", userData);

    let user = await Doctor.findOrCreateGoogleUser(userData);
    console.log("User found or created:", user);

    res.status(200).json({
      googleId: sub,
      email,
      givenName: given_name,
      familyName: family_name,
      profilePicture: picture,
      user,
    });
    console.log("Response sent successfully");
  } catch (error) {
    console.error("Error in Google authentication:", error);
    res.status(400).json({ error: "Google authentication failed" });
  }
};
module.exports = {
  getAllDoctors,
  createDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  googleLogin,
};
