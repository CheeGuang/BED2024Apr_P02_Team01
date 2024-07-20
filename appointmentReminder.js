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
  todayAppointments.forEach(async (appointment) => {
    // Query to find the doctor name
    const doctor = await Doctor.getDoctorById(appointment.DoctorID);
    const patient = await Patient.getPatientById(appointment.PatientID);

    // Write an email
    const emailData = {
      receipients: patient.Email, // Send email to patient
      subject: "Synchealth Appointment Reminder",
      text: `Dear ${patient.givenName} ${patient.familyName},\n\nPlease be reminded that you have an appointment with Dr. ${doctor.familyName} 
      today at ${appointment.endDateTime}. Please get ready 15 minutes prior to your scheduled time.\n\nBest regards,\nSyncHealth Team`,
    };

    sendEmail(emailData);
  });

  console.log("Daily appointment reminder task completed");
};

module.exports.schedule = () => {
  scheduleJob("*/30 * * * *", dailyReminder);
};
