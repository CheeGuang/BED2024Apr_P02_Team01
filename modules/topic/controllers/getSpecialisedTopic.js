// ========== Packages ==========
// Initialising Path Package
const path = require("path");

// ========== getSpecialisedTopic() Logic ==========
const getSpecialisedTopic = async (req, res) => {
  // Response Content
  const responseContent = "Special Hello World";

  // Throw Error is content is not found
  if (!responseContent) throw "Internal Server Error";

  // Send file as the response
  res.status(200).send(responseContent);
};

// ========== Export ==========
module.exports = getSpecialisedTopic;
