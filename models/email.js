const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jeffreyleeprg2@gmail.com",
    pass: "cuhmvmdqllulsucg",
  },
});

async function sendEmail(emailData) {
  try {
    const mailOptions = {
      from: {
        address: "jeffreyleeprg2@gmail.com", // sender address
        name: "SyncHealth",
      },
      to: emailData.receipients, // list of receivers
      subject: emailData.subject, // Subject line
      text: emailData.text, // plain text body
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

async function sendEmailWithAttachment(emailData) {
  try {
    const mailOptions = {
      from: {
        address: "jeffreyleeprg2@gmail.com", // sender address
        name: "SyncHealth",
      },
      to: emailData.receipients, // list of receivers
      subject: emailData.subject, // Subject line
      text: emailData.text, // plain text body
      attachments: emailData.attachments, // array of attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail, sendEmailWithAttachment };
