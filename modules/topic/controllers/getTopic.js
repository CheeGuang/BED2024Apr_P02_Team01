// ========== Packages ==========
// Initialising Path Package
const path = require("path");

// ========== getTopic() Logic ==========
const getTopic = async (req, res) => {
  // Response Content
  const responseContent = "Hello World";

  // Throw Error is content is not found
  if (!responseContent) throw "Internal Server Error";

  // Send file as the response
  res.status(200).send(responseContent);
};

// ========== Export ==========
module.exports = getTopic;
