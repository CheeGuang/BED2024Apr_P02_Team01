const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Authorization Header:", authHeader);
  console.log("Extracted Token:", token);

  if (!token) {
    console.log("No token provided. Unauthorized access attempt.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] },
    (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err.message);
        return res.status(403).json({ message: "Forbidden" });
      }

      console.log("Decoded Token Payload:", decoded);

      // Define endpoints that require PatientID in the token payload
      const patientEndpoints = [
        /^\/api\/patient\/\d+\/eWalletAmount$/,
        /^\/api\/patient\/\d+\/cart$/,
        /^\/api\/patient\/\d+\/clear-cart$/,
        /^\/api\/patient\/\d+\/processPayment$/,
        /^\/api\/appointment\/create$/,
        /^\/api\/appointment\/getByPatientID\/\d+$/,
        /^\/api\/medicine\/patient\/\d+$/,
      ];

      // Define endpoints that require DoctorID in the token payload
      const doctorEndpoints = [
        /^\/api\/appointment\/unassigned$/,
        /^\/api\/appointment\/getByDoctorID\/\d+$/,
        /^\/api\/appointment\/\d+\/updateDoctorId$/,
        /^\/api\/appointment\/\d+\/updateWithMedicines$/,
        /^\/api\/doctor\/\d+$/,
      ];

      const requestedEndpoint = req.baseUrl + req.path;
      const userPatientId = decoded.PatientID;
      const userDoctorId = decoded.DoctorID;

      console.log("Requested Endpoint:", requestedEndpoint);
      console.log("User Patient ID:", userPatientId);
      console.log("User Doctor ID:", userDoctorId);

      const isPatientEndpoint = patientEndpoints.some((endpointRegex) =>
        endpointRegex.test(requestedEndpoint)
      );

      const isDoctorEndpoint = doctorEndpoints.some((endpointRegex) =>
        endpointRegex.test(requestedEndpoint)
      );

      // Check if the requested endpoint requires a PatientID or DoctorID
      if (
        requestedEndpoint.startsWith("/api/appointment") ||
        requestedEndpoint.startsWith("/api/patient") ||
        requestedEndpoint.startsWith("/api/doctor") ||
        requestedEndpoint.startsWith("/api/medicine")
      ) {
        if (!userPatientId && !userDoctorId) {
          console.log(
            "User does not have a PatientID or DoctorID for this endpoint."
          );
          return res.status(403).json({ message: "Forbidden" });
        }
      }

      if (isPatientEndpoint && !userPatientId) {
        console.log("User does not have a patient ID for this endpoint.");
        return res.status(403).json({ message: "Forbidden" });
      }

      if (isDoctorEndpoint && !userDoctorId) {
        console.log("User does not have a doctor ID for this endpoint.");
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded; // Attach decoded user information to the request object
      console.log("Authorization successful. Proceeding to next middleware.");
      next();
    }
  );
}

module.exports = verifyJWT;
