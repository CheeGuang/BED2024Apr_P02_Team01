const { Chatbot, chatbotEmitter } = require("../models/chatbot");
const OpenAI = require("openai");
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { v4: uuidv4 } = require("uuid");

jest.mock("openai");
jest.mock("mssql");

describe("Chatbot Model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("initializeChat", () => {
    it("should initialize a chat session and save the initial prompt", async () => {
      const mockPatientId = "patient123";
      const mockChatSessionId = "session123";
      const chatbot = new Chatbot();

      const saveChatHistoryMock = jest
        .spyOn(chatbot, "saveChatHistory")
        .mockResolvedValue();

      const chatSessionId = await chatbot.initializeChat(mockPatientId);

      expect(saveChatHistoryMock).toHaveBeenCalledWith(
        expect.any(String),
        mockPatientId,
        "bot",
        expect.any(String) // We can check if the string starts with the initial prompt if needed
      );
    });
  });

  describe("sendMessage", () => {
    it("should handle errors from OpenAI", async () => {
      const mockChatSessionId = "session123";
      const mockPatientId = "patient123";
      const userMessage = "What is the flu?";

      const chatbot = new Chatbot();
      jest
        .spyOn(chatbot, "getChatHistory")
        .mockResolvedValue([{ sender: "user", message: "What is the flu?" }]);
      jest.spyOn(chatbot, "saveChatHistory").mockResolvedValue();
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error("OpenAI API error")),
          },
        },
      }));
      console.error = jest.fn();

      await expect(
        chatbot.sendMessage(mockChatSessionId, mockPatientId, userMessage)
      ).rejects.toThrow("Failed to get response from OpenAI");

      expect(console.error).toHaveBeenCalledWith(
        "Error calling OpenAI API: Cannot read properties of undefined (reading 'completions')"
      );
    });
  });

  describe("saveChatHistory", () => {
    it("should save chat history to the database", async () => {
      const mockChatSessionId = "session123";
      const mockPatientId = "patient123";
      const sender = "user";
      const message = "What is the flu?";

      const chatbot = new Chatbot();
      const sqlConnectMock = jest.spyOn(sql, "connect").mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue(),
        }),
        close: jest.fn(),
      });

      await chatbot.saveChatHistory(
        mockChatSessionId,
        mockPatientId,
        sender,
        message
      );

      expect(sqlConnectMock).toHaveBeenCalledWith(dbConfig);
    });
  });

  describe("getChatHistory", () => {
    it("should retrieve chat history from the database", async () => {
      const mockChatSessionId = "session123";
      const mockChatHistory = [
        { sender: "user", message: "What is the flu?" },
        {
          sender: "bot",
          message: "The flu is a respiratory illness. Please consult a doctor.",
        },
      ];

      const chatbot = new Chatbot();
      const sqlConnectMock = jest.spyOn(sql, "connect").mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: mockChatHistory }),
        }),
        close: jest.fn(),
      });

      const chatHistory = await chatbot.getChatHistory(mockChatSessionId);

      expect(chatHistory).toEqual(mockChatHistory);
      expect(sqlConnectMock).toHaveBeenCalledWith(dbConfig);
    });
  });
});
