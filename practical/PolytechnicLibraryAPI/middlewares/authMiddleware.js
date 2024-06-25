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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden" });
    }

    console.log("Decoded Token Payload:", decoded);

    // Check user role for authorization (replace with your logic)
    const authorizedRoles = {
      "^/api/books": ["member", "librarian"], // Anyone can view books
      "^/api/books/[0-9]+/availability$": ["librarian"], // Only librarians can update availability
      "^/api/users*": ["librarian"], // Only librarians can get all users
      "^/api/userBooks*": ["librarian"], // Only librarians can get all users
    };

    const requestedEndpoint = req.baseUrl + req.path;
    const userRole = decoded.role;

    console.log("Requested Endpoint:", requestedEndpoint);
    console.log("User Role:", userRole);

    const isAuthorized = Object.entries(authorizedRoles).some(
      ([endpoint, roles]) => {
        const regex = new RegExp(endpoint);
        const match = regex.test(requestedEndpoint);
        console.log(
          `Checking endpoint ${endpoint} against ${requestedEndpoint}: ${match}`
        );
        return match && roles.includes(userRole);
      }
    );

    if (!isAuthorized) {
      console.log("User role not authorized for this endpoint.");
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    console.log("Authorization successful. Proceeding to next middleware.");
    next();
  });
}

module.exports = verifyJWT;
