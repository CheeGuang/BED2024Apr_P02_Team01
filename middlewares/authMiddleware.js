const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] },
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

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
          return res.status(403).json({ message: "Forbidden" });
        }
      }

      if (isPatientEndpoint && !userPatientId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (isDoctorEndpoint && !userDoctorId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded; // Attach decoded user information to the request object
      console.log("Authorization successful. Proceeding to next middleware.");
      next();
    }
  );
}

module.exports = verifyJWT;
