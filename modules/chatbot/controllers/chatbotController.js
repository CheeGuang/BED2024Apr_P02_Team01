const sql = require("mssql");
const dbConfig = require("../../../dbConfig");
const { Chatbot, chatbotEmitter } = require("../../../models/chatbot");
const chatBotInstance = new Chatbot();
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

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

const saveRecognitionHistory = async (req, res) => {
  try {
    const { patientID, medicineName, mainPurpose, sideEffects, recommendedDosage, otherRemarks } = req.body;
    const promptID = uuidv4();

    await chatBotInstance.saveRecognitionHistory(promptID, patientID, medicineName, mainPurpose, sideEffects, recommendedDosage, otherRemarks);

    res.status(200).json({
      status: "Success",
      message: "Recognition history saved successfully",
      promptID
    });
  } catch (error) {
    console.error("Error saving recognition history:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const analyzeImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ status: "Failed", message: "No image file uploaded" });
    }
    const imageFile = req.files.image;
    const imagePath = path.join(__dirname, "../../../uploads", imageFile.name);

    // Save the uploaded file
    imageFile.mv(imagePath, async (err) => {
      if (err) {
        return res.status(500).json({ status: "Failed", message: "Failed to save image file" });
      }

      // Analyze the image using Tesseract.js
      try {
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
          logger: m => console.log(m)
        });

        const patientDetails = JSON.parse(req.body.patientDetails);
        const patientID = patientDetails.PatientID;

        // Send the extracted text to OpenAI for analysis
        const responseMessage = await chatBotInstance.analyzeText(patientID, text);
        res.status(200).json({
          status: "Success",
          message: "Image analyzed successfully",
          response: responseMessage,
        });
      } catch (error) {
        res.status(500).json({ status: "Failed", message: error.message });
      } finally {
        // Clean up the uploaded file
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete uploaded image file:", err);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const getRecognitionHistory = async (req, res) => {
  try {
    const { patientID } = req.params;
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      SELECT MedicineName, MainPurpose, SideEffects, RecommendedDosage, OtherRemarks, Timestamp
      FROM MedicineRecognitionHistory
      WHERE PatientID = @PatientID
      ORDER BY Timestamp DESC
    `;
    const request = connection.request();
    request.input("PatientID", sql.Int, patientID);
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length > 0) {
      res.status(200).json({
        status: "Success",
        history: result.recordset,
      });
    } else {
      res.status(200).json({
        status: "Success",
        history: [],
      });
    }
  } catch (error) {
    console.error("Error fetching recognition history:", error);
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

module.exports = {
  initializeChatSession,
  sendMessageToChatbot,
  getChatHistory,
  handleChatSSEUpdates,
  analyzeImage,
  saveRecognitionHistory,
  getRecognitionHistory,
};

