const { scheduleJob } = require("node-schedule");
const { Appointment } = require("./models/appointment"); // Import the Appointment model
const Doctor = require("./models/doctor"); // Import the Doctor model
const Patient = require("./models/patient");
const { sendEmail } = require("./models/email"); // Import the email middleware

// Schedule a daily task to run at 8am every day "0 8 * * *"
const dailyReminder = async () => {
  console.log("Running daily appointment reminder task");

  // Get all appointments for today
  const today = new Date();
  const todayAppointments = await Appointment.getAppointmentsByDate(
    today.toISOString().slice(0, 10)
  );

  // Loop through each appointment and send a reminder email
  for (const appointment of todayAppointments) {
    // Query to find the doctor name
    const doctor = await Doctor.getDoctorById(appointment.DoctorID);
    const patient = await Patient.getPatientById(appointment.PatientID);

    // Convert endDateTime to local time by adding 7 hours
    const appointmentEndDateTime = new Date(appointment.endDateTime);
    appointmentEndDateTime.setHours(appointmentEndDateTime.getHours() + 7);

    // Format the new local time as a string
    const localEndDateTime = appointmentEndDateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Write an email
    console.log("Patient ID: " + appointment.PatientID);
    console.log("Patient Email: " + patient.Email);
    const emailData = {
      recipients: patient.Email, // Send email to patient
      subject: "Appointment Reminder",
      text: `Dear ${patient.givenName},\n\nPlease be reminded that you have an appointment with Dr. ${doctor.familyName} 
      today at ${localEndDateTime}. Please get ready 15 minutes prior to your scheduled time.\n\nBest regards,\nSyncHealth Team`,
    };

    sendEmail(emailData);
  }

  console.log("Daily appointment reminder task completed");
};

module.exports.schedule = () => {
  scheduleJob("*/2 * * * *", dailyReminder);
};
