// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising getTopic
const getTopic = require("./controllers/getTopic");
// Initialising getSpecialisedTopic
const getSpecialisedTopic = require("./controllers/getSpecialisedTopic");

// ========== Set-up ==========
// Initialising topicRoutes
const topicRoutes = express.Router();

// ========== Routes ==========
// GET Topic
topicRoutes.get("/", getTopic);
// To call this controller: http://localhost:8000/api/topic/
// GET Specialised Topic
topicRoutes.get("/specialised", getSpecialisedTopic);
// To call this controller: http://localhost:8000/api/topic/specialised

// ========== Export ==========
module.exports = topicRoutes;
