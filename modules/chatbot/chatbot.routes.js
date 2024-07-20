// ========== Packages ==========
// Initializing express
const express = require("express");
const fileUpload = require("express-fileupload");

// ========== Controllers ==========
// Initializing chatbotController
const chatbotController = require("./controllers/chatbotController");

// ========== Set-up ==========
// Initializing chatbotRoutes
const chatbotRoutes = express.Router();

chatbotRoutes.use(fileUpload({
    createParentPath: true // Ensure parent paths are created if they do not exist
  }));

// ========== Routes ==========
// Initialize a new chat session for a patient
chatbotRoutes.post("/initialize", chatbotController.initializeChatSession);

// Send a message to the chatbot and get a response
chatbotRoutes.post("/send-message", chatbotController.sendMessageToChatbot);

// Get chat history for a specific chat session
chatbotRoutes.get("/history/:chatSessionId", chatbotController.getChatHistory);

// Endpoint to listen for updates (SSE)
chatbotRoutes.get("/updates/:chatSessionId", chatbotController.handleChatSSEUpdates);

// Route to handle image upload and analysis
chatbotRoutes.post('/upload', chatbotController.analyzeImage);

// Route for saving recognition history
chatbotRoutes.post('/save-recognition-history', chatbotController.saveRecognitionHistory);

//Route to get recognition history from DataBase
chatbotRoutes.get('/recognition-history/:patientID', chatbotController.getRecognitionHistory); 

// ========== Export Route ==========
// Export the chatbot routes to be used in other parts of the application
module.exports = chatbotRoutes;
