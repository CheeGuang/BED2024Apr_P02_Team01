require("dotenv").config();

const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userBookRoutes = require("./routes/userBookRoutes");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const app = express();
const port = process.env.PORT; // Use environment variable or default port

// Importing Static Middleware
const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware); // Mount the static middleware

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/userBooks", userBookRoutes);
app.use("/api/books", bookRoutes);

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
