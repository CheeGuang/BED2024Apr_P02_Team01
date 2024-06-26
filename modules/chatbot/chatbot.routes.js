// ========== Packages ==========
// Initializing express
const express = require("express");

// ========== Controllers ==========
// Initializing chatbotController
const chatbotController = require("./controllers/chatbotController");

// ========== Set-up ==========
// Initializing chatbotRoutes
const chatbotRoutes = express.Router();

// ========== Routes ==========
// Initialize a new chat session for a patient
chatbotRoutes.post("/initialize", chatbotController.initializeChatSession);

// Send a message to the chatbot and get a response
chatbotRoutes.post("/send-message", chatbotController.sendMessageToChatbot);

// Get chat history for a specific chat session
chatbotRoutes.get("/history/:chatSessionId", chatbotController.getChatHistory);

// Endpoint to listen for updates (SSE)
chatbotRoutes.get("/updates/:chatSessionId", chatbotController.handleChatSSEUpdates);

// ========== Export Route ==========
// Export the chatbot routes to be used in other parts of the application
module.exports = chatbotRoutes;
