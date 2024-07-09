// ========== Packages ==========
// Initialising Express Async Error
require("express-async-errors");
// Initialising dotenv
require("dotenv").config();
// Initialising express
const express = require("express");
// Initialising path
const path = require("path");
// Initialising errorHandler
const ErrorHandler = require("./handlers/errorHandler");
// Initialising patientRoutes
const patientRoutes = require("./modules/patient/patient.routes");
// Initialising doctorRoutes
const doctorRoutes = require("./modules/doctor/doctor.routes");
// Initialising medicineRoutes
const medicineRoutes = require("./modules/medicine/medicine.routes");
// Initialising appointmentRoutes
const appointmentRoutes = require("./modules/appointment/appointment.routes");
// Initialising chatbotRoutes
const chatbotRoutes = require("./modules/chatbot/chatbot.routes");
// Initialising chasClinicRoutes
const chasClinicRoutes = require("./modules/chasClinic/chasClinic.routes");
// Initialising SQL
const sql = require("mssql");
// Initialising dbConfig file
const dbConfig = require("./dbConfig");
// Initialising express-session
const session = require("express-session");
// Initialising passport
const passport = require("./auth"); // Ensure the correct path
// Initialising Authorizaton Middleware
const authMiddleware = require("./middlewares/authMiddleware"); // Adjust the path to where your middleware is located
// Initialising Swagger API Packages
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

// ========== Set-Up ==========
// Initiating app
const app = express();
const port = 8000;
// Using Static Public
app.use(express.static("public"));
// Using JSON
app.use(express.json());
// Using Session I
app.use(
  session({
    secret: process.env.sessionSecretKey,
    resave: false,
    saveUninitialized: false,
  })
);

// Using Passport
app.use(passport.initialize());
// Using Session II
app.use(passport.session());

// Return index.html at default endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "public", "index.html"));
});

// ========== Routes ==========
// Appointment Route
app.use("/api/appointment", appointmentRoutes);

// Patient Routes Route
app.use("/api/patient", patientRoutes);

// Datient Routes Route
app.use("/api/doctor", doctorRoutes);

// Medicine Routes Route
app.use("/api/medicine", medicineRoutes);

// Chatbot Routes Route
app.use("/api/chatbot", chatbotRoutes);

// chasClinicRoutes Routes Route
app.use("/api/chasClinic", chasClinicRoutes);

// Check Auth Endpoint
app.get("/api/checkAuth", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// End of all routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "Not found!",
  });
});

// ========== Error Handler ==========
// Async Error Handler
app.use(ErrorHandler);

// ========== Initialise Server ==========
// Server Listening at port 8000
app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server successfully running on http://localhost:${port}`);
  console.log("Press CTRL+C to stop the server.");
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
