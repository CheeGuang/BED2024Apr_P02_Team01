// Configuring dotenv package
require("dotenv").config();

// Importing express package
const express = require("express");
// Importing path package
const path = require("path");
// Importing errorHandler package
const ErrorHandler = require("./handlers/errorHandler");

// Initiating app
const app = express();
const port = 8000;

// Return index.html at default endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "public", "index.html"));
});

// End of all routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "Not found!",
  });
});

// Async Error Handler
app.use(ErrorHandler);

// Server Listening at port 8000
app.listen(port, () => {
  console.log(`Server successfully running on http://localhost:${port}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("Press CTRL+C to stop the server.");
});
