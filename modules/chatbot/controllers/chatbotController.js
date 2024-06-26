const { Chatbot, chatbotEmitter } = require("../../../models/chatbot");
const chatBotInstance = new Chatbot();

/**
 * Controller to initialize a chat session for a patient.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const initializeChatSession = async (req, res) => {
  try {
    const { patientId } = req.body;
    const chatSessionId = await chatBotInstance.initializeChat(patientId);
    res.status(200).json({
      status: "Success",
      message: "Chat session initialized successfully",
      chatSessionId,
    });
  } catch (error) {
    console.error("Error initializing chat session:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

/**
 * Controller to send a message to the chatbot and get a response.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const sendMessageToChatbot = async (req, res) => {
  try {
    const { chatSessionId, patientId, message } = req.body;
    const responseMessage = await chatBotInstance.sendMessage(
      chatSessionId,
      patientId,
      message
    );
    res.status(200).json({
      status: "Success",
      message: "Message sent successfully",
      response: responseMessage,
    });
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

/**
 * Controller to get chat history for a specific chat session.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getChatHistory = async (req, res) => {
  try {
    const { chatSessionId } = req.params;
    const chatHistory = await chatBotInstance.getChatHistory(chatSessionId);
    res.status(200).json({
      status: "Success",
      chatHistory,
    });
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

/**
 * Controller to handle SSE connections for chat updates.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const handleChatSSEUpdates = (req, res) => {
  const { chatSessionId } = req.params;
  console.log(
    `SSE connection established for chat session ID: ${chatSessionId}`
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onUpdate = (data) => {
    if (data.chatSessionId === chatSessionId) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  chatbotEmitter.on("chatUpdated", onUpdate);
  console.log(`Listener added for chat session ID: ${chatSessionId}`);

  req.on("close", () => {
    chatbotEmitter.removeListener("chatUpdated", onUpdate);
    console.log(`SSE connection closed for chat session ID: ${chatSessionId}`);
  });
};

module.exports = {
  initializeChatSession,
  sendMessageToChatbot,
  getChatHistory,
  handleChatSSEUpdates,
};
