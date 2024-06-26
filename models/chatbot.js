require("dotenv").config();
const OpenAI = require("openai");
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const EventEmitter = require("events");
const { v4: uuidv4 } = require("uuid");

const openai = new OpenAI({
  apiKey: process.env.openAISecretKey,
});

class ChatbotEmitter extends EventEmitter {}
const chatbotEmitter = new ChatbotEmitter();

class Chatbot {
  async initializeChat(patientId) {
    const chatSessionId = uuidv4();
    const initialPrompt = `
      You are Health Buddy, an AI Doctor that will answer any patient's queries. You should give prudent answers and advise users to refer to their doctor when in any doubt. However, for simple health queries, you should provide valid responses.
  
      - Answers must be formatted neatly, adding regular \n after each new topic.
      - Give an answer that layman can understand.
      - Be concise, friendly, and cheerful.
      - Remind the user to visit a doctor at the end of each reply.
    `;

    await this.saveChatHistory(chatSessionId, patientId, "bot", initialPrompt);

    return chatSessionId;
  }

  async sendMessage(chatSessionId, patientId, message) {
    console.log(
      `Saving chat history for session: ${chatSessionId}, patient: ${patientId}, message: ${message}`
    );
    await this.saveChatHistory(chatSessionId, patientId, "user", message);

    console.log(`Retrieving chat history for session: ${chatSessionId}`);
    const chatHistory = await this.getChatHistory(chatSessionId);
    console.log(`Chat history: ${JSON.stringify(chatHistory)}`);

    // Filter out any entries with invalid message content (e.g., null or non-string values)
    const messages = chatHistory
      .filter(
        (entry) =>
          entry.message &&
          typeof entry.message === "string" &&
          entry.message.trim() !== ""
      )
      .map((entry) => ({
        role: entry.sender === "user" ? "user" : "system",
        content: entry.message,
      }));
    console.log(`Filtered messages: ${JSON.stringify(messages)}`);

    // Include the current message in the request to OpenAI
    messages.push({
      role: "user",
      content: message,
    });

    // Make the API call to OpenAI
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      console.log(`OpenAI response: ${JSON.stringify(completion)}`);

      // Extract and save the bot's response
      const botMessage = completion.choices[0].message.content.trim();
      console.log(`Bot message: ${botMessage}`);

      console.log(
        `Saving bot response to chat history for session: ${chatSessionId}, patient: ${patientId}`
      );
      await this.saveChatHistory(chatSessionId, patientId, "bot", botMessage);

      return botMessage;
    } catch (error) {
      console.error(`Error calling OpenAI API: ${error.message}`);
      throw new Error("Failed to get response from OpenAI");
    }
  }

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
