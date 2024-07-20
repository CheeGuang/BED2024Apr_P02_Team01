const { sendEmail } = require("../../../models/email.js");
const Patient = require("../../../models/patient.js");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.googleId);

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
      Address: null, // Fill in as necessary
      eWalletAmount: 0, // Default value
      resetPasswordCode: null, // Default value
      PCHI: null, // Default value
      givenName: given_name,
      familyName: family_name,
      profilePicture: picture, // Updated field name
    };

    console.log("User data constructed:", userData);

    let user = await Patient.findOrCreateGoogleUser(userData);
    console.log("User found or created:", user);

    const payload = {
      PatientID: user.PatientID,
      email: user.Email,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "3600s", // This should be inside the options object
    });

    console.log(`JWT Token: ${jwtToken}`);

    // Call the sendEmailFunction
    const emailData = {
      receipients: user.Email,
      subject: "SyncHealth: Security Alert",
      text: "You have signed in to SyncHealth successfully. If this was you, you don't need to do anything. If not, please contact us. \n\nBest regards,\nSyncHealth Team",
    };
    sendEmail(emailData)
      .then((result) => {
        console.log("Login Email sent!");
      })
      .catch((error) => {
        console.error("Error sending login email: " + error);
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

const getGuestPatient = async (req, res) => {
  try {
    const patient = await Patient.getGuestPatient();
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    const payload = {
      PatientID: patient.PatientID,
      email: patient.Email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "3600s", // This should be inside the options object
    });

    console.log(`JWT Token: ${token}`);

    res.json({
      user: patient,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving patient");
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

    const payload = {
      PatientID: updatedPatient.PatientID,
      email: updatedPatient.Email,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "3600s", // This should be inside the options object
    });

    console.log(`JWT Token: ${jwtToken}`);

    res.status(200).json({
      user: updatedPatient,
      token: jwtToken,
    });
    console.log("Response sent successfully");
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

const updateAccountName = async (req, res) => {
  const patientId = parseInt(req.params.id);
  const { fname, lname } = req.body;

  try {
    const updatedName = await Patient.updateAccountName(
      patientId,
      fname,
      lname
    );
    if (!updatedName) {
      return res.status(404).send("Patient not found");
    }
    res.json({
      status: "Success",
      FirstName: updatedName.givenName,
      LastName: updatedName.familyName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating patient's name");
  }
};

const updateAccountContact = async (req, res) => {
  const patientId = parseInt(req.params.id);
  const { contact } = req.body;

  try {
    const updatedContact = await Patient.updateAccountContact(
      patientId,
      contact
    );
    if (!updatedContact) {
      return res.status(404).send("Patient not found");
    }
    res.json({
      status: "Success",
      ContactNumber: updatedContact.ContactNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating patient's contact");
  }
};

const updateAccountDOB = async (req, res) => {
  const patientId = parseInt(req.params.id);
  const { dob } = req.body;

  try {
    const updatedDOB = await Patient.updateAccountDOB(patientId, dob);
    if (!updatedDOB) {
      return res.status(404).send("Patient not found");
    }
    res.json({
      status: "Success",
      DOB: updatedDOB.DOB,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating patient's birthdate");
  }
};

const updateAccountAddress = async (req, res) => {
  const patientId = parseInt(req.params.id);
  const { address } = req.body;

  try {
    const updatedAddress = await Patient.updateAccountAddress(
      patientId,
      address
    );
    if (!updatedAddress) {
      return res.status(404).send("Patient not found");
    }
    res.json({
      status: "Success",
      Address: updatedAddress.Address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating patient's contact");
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

const getEWalletAmount = async (req, res) => {
  const patientId = parseInt(req.params.id);
  try {
    const patient = await Patient.getPatientById(patientId);
    if (!patient) {
      console.log(`Patient with ID ${patientId} not found`);
      return res
        .status(404)
        .json({ status: "Failed", message: "Patient not found" });
    }
    res.json({ status: "Success", eWalletAmount: patient.eWalletAmount });
  } catch (error) {
    console.error(
      `Error retrieving e-wallet amount for Patient ID ${patientId}:`,
      error
    );
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error" });
  }
};

const updateEWalletAmount = async (req, res) => {
  const patientId = parseInt(req.params.id);
  const { amount } = req.body;

  try {
    const updatedPatient = await Patient.updateEWalletAmount(patientId, amount);
    if (!updatedPatient) {
      return res.status(404).send("Patient not found");
    }
    res.json({
      status: "Success",
      eWalletAmount: updatedPatient.eWalletAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating eWallet amount");
  }
};

async function updatePatientCart(req, res) {
  const patientId = req.params.patientId;
  const newItem = req.body;

  try {
    const updatedPatient = await Patient.updateCart(patientId, newItem);
    res.json({ status: "Success", data: updatedPatient });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
}

const clearCart = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    await Patient.clearCart(patientId);
    res.json({ status: "Success", message: "Cart cleared!" });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({ status: "Failed", message: "Failed to clear cart" });
  }
};

const processMedicinePayment = async (req, res) => {
  const patientId = parseInt(req.params.id);
  const { totalAmount } = req.body; // The total amount including GST

  try {
    const patient = await Patient.getPatientById(patientId);
    if (!patient) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Patient not found" });
    }

    if (patient.eWalletAmount < totalAmount) {
      return res.status(400).json({
        status: "Failed",
        message: "Insufficient E-Wallet Balance. Please Top-Up.",
      });
    }

    const updatedPatient = await Patient.updateEWalletAmount(
      patientId,
      -totalAmount
    ); // Deduct the total amount

    // Clear the cart after payment
    await Patient.clearCart(patientId);

    res.json({
      status: "Success",
      message:
        "Payment Successful. Your Medicine will be shipped within 5 working days",
      eWalletAmount: updatedPatient.eWalletAmount,
    });
  } catch (error) {
    console.error(
      `Error processing payment for Patient ID ${patientId}:`,
      error
    );
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error" });
  }
};

module.exports = {
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  updateAccountName,
  updateAccountContact,
  updateAccountDOB,
  updateAccountAddress,
  searchPatients,
  googleLogin,
  updatePatientCart,
  clearCart,
  getGuestPatient,
  getEWalletAmount,
  updateEWalletAmount,
  processMedicinePayment, // Add this line
};
