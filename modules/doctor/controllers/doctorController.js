const Doctor = require("../../../models/doctor.js");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.googleId);
const jwt = require("jsonwebtoken");

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

const getGuestDoctor = async (req, res) => {
  try {
    const user = await Doctor.getGuestDoctor();
    if (!user) {
      return res.status(404).send("Doctor not found");
    }

    const payload = {
      DoctorID: user.DoctorID,
      email: user.Email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "3600s", // This should be inside the options object
    });

    res.json({ user, token });
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

  console.log("updateDoctor Function Called");
  console.log("Doctor ID:", doctorId);
  console.log("New Doctor Data:", newDoctorData);

  try {
    const updatedDoctor = await Doctor.updateDoctor(doctorId, newDoctorData);
    console.log("Updated Doctor:", updatedDoctor);

    if (!updatedDoctor) {
      console.log("Doctor not found");
      return res.status(404).send("Doctor not found");
    }

    res.json(updatedDoctor);
    console.log("Response sent successfully");
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).send("Error updating doctor");
  }
};

const updateDocAccountName = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { fname, lname } = req.body;

  try {
    const updatedName = await Doctor.updateDocAccountName(
      doctorId,
      fname,
      lname
    );
    if (!updatedName) {
      return res.status(404).send("Doctor not found");
    }
    res.json({
      status: "Success",
      FirstName: updatedName.givenName,
      LastName: updatedName.familyName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating doctor's name");
  }
};

const updateDocAccountContact = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { contact } = req.body;

  try {
    const updatedContact = await Doctor.updateDocAccountContact(
      doctorId,
      contact
    );
    if (!updatedContact) {
      return res.status(404).send("Doctor not found");
    }
    res.json({
      status: "Success",
      ContactNumber: updatedContact.ContactNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating doctor's contact");
  }
};

const updateDocAccountDOB = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { dob } = req.body;

  try {
    const updatedDOB = await Doctor.updateDocAccountDOB(doctorId, dob);
    if (!updatedDOB) {
      return res.status(404).send("Doctor not found");
    }
    res.json({
      status: "Success",
      DOB: updatedDOB.DOB,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating doctor's birthdate");
  }
};

const updateDocAccountProfession = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { profession } = req.body;

  try {
    const updatedProfession = await Doctor.updateDocAccountProfession(
      doctorId,
      profession
    );
    if (!updatedProfession) {
      return res.status(404).send("Doctor not found");
    }
    res.json({
      status: "Success",
      profession: updatedProfession.Profession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating doctor's profession");
  }
};

module.exports = {
  updateDoctor,
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

    const payload = {
      DoctorID: user.DoctorID,
      email: user.Email,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3600s",
    });

    res.status(200).json({
      user,
      token: jwtToken,
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
  updateDocAccountName,
  updateDocAccountContact,
  updateDocAccountDOB,
  updateDocAccountProfession,
  deleteDoctor,
  googleLogin,
  getGuestDoctor,
};
