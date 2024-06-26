const { Configuration, OpenAIApi } = require("openai"); // Import OpenAI API client
const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration
const EventEmitter = require("events");
const { v4: uuidv4 } = require("uuid"); // Import UUID library for unique chat session IDs

class ChatbotEmitter extends EventEmitter {}
const chatbotEmitter = new ChatbotEmitter();

/**
 * Class representing a Chatbot.
 */
class Chatbot {
  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.openAISecretKey, // Use the API key from environment variables
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  /**
   * Initialize a chat session for a patient.
   * @param {number} patientId - The ID of the patient.
   * @returns {Promise<string>} A promise that resolves to the chat session ID.
   */
  async initializeChat(patientId) {
    const chatSessionId = uuidv4(); // Generate a unique chat session ID
    const initialPrompt = `
      You are Health Buddy, an AI Doctor that will answer any patient's queries. You should give prudent answers and advise users to refer to their doctor when in any doubt. However, for simple health queries, you should provide valid responses.
    `;

    await this.saveChatHistory(chatSessionId, patientId, "bot", initialPrompt);

    return chatSessionId;
  }

  /**
   * Send a message to the chatbot and get a response.
   * @param {string} chatSessionId - The chat session ID.
   * @param {number} patientId - The ID of the patient.
   * @param {string} message - The patient's message.
   * @returns {Promise<string>} A promise that resolves to the bot's response.
   */
  async sendMessage(chatSessionId, patientId, message) {
    await this.saveChatHistory(chatSessionId, patientId, "user", message);

    const chatHistory = await this.getChatHistory(chatSessionId);

    const messages = chatHistory.map((entry) => {
      return {
        role: entry.sender === "user" ? "user" : "system",
        content: entry.message,
      };
    });

    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const botMessage = response.data.choices[0].message.content.trim();
    await this.saveChatHistory(chatSessionId, patientId, "bot", botMessage);

    return botMessage;
  }

  /**
   * Save chat history to the database.
   * @param {string} chatSessionId - The chat session ID.
   * @param {number} patientId - The ID of the patient.
   * @param {string} sender - The sender of the message ("user" or "bot").
   * @param {string} message - The message content.
   * @returns {Promise<void>} A promise that resolves when the chat history is saved.
   */
  async saveChatHistory(chatSessionId, patientId, sender, message) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      INSERT INTO ChatHistory (ChatSessionID, PatientID, Sender, Message, Timestamp)
      VALUES (@ChatSessionID, @PatientID, @Sender, @Message, GETDATE())
    `;
    const request = connection.request();
    request.input("ChatSessionID", chatSessionId);
    request.input("PatientID", patientId);
    request.input("Sender", sender);
    request.input("Message", message);
    await request.query(sqlQuery);
    connection.close();
  }

  /**
   * Get chat history for a specific chat session.
   * @param {string} chatSessionId - The chat session ID.
   * @returns {Promise<{sender: string, message: string}[]>} A promise that resolves to an array of chat history entries.
   */
  async getChatHistory(chatSessionId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      SELECT Sender, Message
      FROM ChatHistory
      WHERE ChatSessionID = @ChatSessionID
      ORDER BY Timestamp ASC
    `;
    const request = connection.request();
    request.input("ChatSessionID", chatSessionId);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset;
  }
}

module.exports = { Chatbot, chatbotEmitter };
