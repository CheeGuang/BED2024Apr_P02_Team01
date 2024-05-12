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
// Initialising topicRoutes (Template)
const topicRoutes = require("./modules/topic/topic.routes");
// Initialising appointmentRoutes
const appointmentRoutes = require("./modules/appointment/appointment.routes");

// ========== Set-Up ==========
// Initiating app
const app = express();
const port = 8000;
// Using Static Public
app.use(express.static("public"));
// Using JSON
app.use(express.json());
// Return index.html at default endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "public", "index.html"));
});

// ========== Routes ==========
// Topic Route (Template)
app.use("/api/topic", topicRoutes);
// Appointment Route
app.use("/api/appointment", appointmentRoutes);
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
app.listen(port, () => {
  console.log(`Server successfully running on http://localhost:${port}`);
  console.log("Press CTRL+C to stop the server.");
});
