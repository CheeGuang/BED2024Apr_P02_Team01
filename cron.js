const cron = require("node-cron");
const Appointment = require("./models/appointment"); // Import the Appointment model
const Doctor = require("./models/doctor"); // Import the Doctor model
const Patient = require("./models/patient");
const sendEmailMiddleware = require("./sendEmailMiddleware"); // Import the email middleware

// Schedule a daily task to run at 8am every day
cron.schedule("0 8 * * *", async () => {
  console.log("Running daily appointment reminder task");

  // Get all appointments for today
  const today = new Date();
  const todayAppointments = await Appointment.getAppointmentsByDate(
    today.toISOString().slice(0, 10)
  );

  // Loop through each appointment and send a reminder email
  todayAppointments.forEach((appointment) => {
    // Query to find the doctor name
    const doctor = new Doctor();
    if (appointment.DoctorID != null) {
      // Find the doctor name
      doctor = async () => {
        await Doctor.getDoctorById(appointment.DoctorID);
      };
    }

    // Query to find patient's email and name
    const patient = new Patient();
    patient = async () => {
      await Patient.getPatientById(appointment.PatientID);
    };
    // Write an email
    const emailData = {
      receipients: patient.Email, // Send email to patient
      subject: "Synchealth Appointment Reminder",
      text: `Hello ${patient.givenName} ${patient.familyName}, this is a reminder that you have an appointment with Dr. ${doctor.givenName} ${doctor.familyName} today at ${appointment.endDateTime}. Please get ready 15 minutes prior to your scheduled time.`,
    };

    sendEmailMiddleware(null, null, null, emailData);
  });

  console.log("Daily appointment reminder task completed");
});

// Define a function to get all appointments for today
Appointment.getAllAppointmentsForToday = async (today) => {
  const connection = await sql.connect(dbConfig);
  const sqlQuery = `SELECT * FROM Appointment WHERE endDateTime >= @today AND endDateTime < @tomorrow`;
  const request = connection.request();
  request.input("today", today);
  request.input("tomorrow", new Date(today.getTime() + 24 * 60 * 60 * 1000));
  const result = await request.query(sqlQuery);
  connection.close();
  return result.recordset;
};
