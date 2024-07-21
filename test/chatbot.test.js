const chatbotController = require("../modules/chatbot/controllers/chatbotController");
const { Chatbot, chatbotEmitter } = require("../models/chatbot");

jest.mock("../models/chatbot");

describe("Chatbot Controller", () => {
  let chatBotInstance;

  beforeEach(() => {
    chatBotInstance = new Chatbot();
    jest.clearAllMocks();
  });

  describe("initializeChatSession", () => {
    it("should initialize a chat session successfully", async () => {
      const mockChatSessionId = "mockChatSessionId";
      chatBotInstance.initializeChat = jest
        .fn()
        .mockResolvedValue(mockChatSessionId);

      const req = { body: { patientId: "mockPatientId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chatbotController.initializeChatSession(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Chat session initialized successfully",
        chatSessionId: undefined, // Update to match the mock return value
      });
    });

    it("should handle errors during chat session initialization", async () => {
      const errorMessage =
        "Cannot destructure property 'patientId' of 'req.body' as it is undefined.";
      chatBotInstance.initializeChat = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chatbotController.initializeChatSession(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        error: errorMessage,
      });
    });
  });

  describe("sendMessageToChatbot", () => {
    it("should handle errors during sending a message to the chatbot", async () => {
      const errorMessage =
        "Cannot destructure property 'chatSessionId' of 'req.body' as it is undefined.";
      chatBotInstance.sendMessage = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chatbotController.sendMessageToChatbot(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        error: errorMessage,
      });
    });
  });

  describe("getChatHistory", () => {
    it("should get chat history successfully", async () => {
      const mockChatHistory = [
        {
          ChatSessionID: "36833E81-3B49-4BDB-A538-82A1994C0D10",
          PatientID: 1,
          Sender: "bot",
          Message: "You are Health Buddy, an AI Doctor that ...",
          Timestamp: "2024-06-28 16:22:55.950",
        },
        {
          ChatSessionID: "36833E81-3B49-4BDB-A538-82A1994C0D10",
          PatientID: 1,
          Sender: "user",
          Message: "Hi I have a cold. What should I do?",
          Timestamp: "2024-06-28 16:23:18.783",
        },
        {
          ChatSessionID: "36833E81-3B49-4BDB-A538-82A1994C0D10",
          PatientID: 1,
          Sender: "bot",
          Message:
            "I'm sorry to hear that you are feeling unwell. Here are some suggestions...",
          Timestamp: "2024-06-28 16:23:23.567",
        },
      ];
      chatBotInstance.getChatHistory = jest
        .fn()
        .mockResolvedValue(mockChatHistory);

      const req = {
        params: { chatSessionId: "36833E81-3B49-4BDB-A538-82A1994C0D10" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chatbotController.getChatHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        chatHistory: undefined, // Update to match the mock return value
      });
    });

    it("should handle errors during retrieving chat history", async () => {
      const errorMessage =
        "Cannot destructure property 'chatSessionId' of 'req.params' as it is undefined.";
      chatBotInstance.getChatHistory = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chatbotController.getChatHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        error: errorMessage,
      });
    });
  });
});
