const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jeffreyleeprg2@gmail.com",
    pass: "cuhmvmdqllulsucg",
  },
});

const sendEmailMiddleware = async (req, res, next, emailData) => {
  try {
    //const transporter = await createTransporter();
    const mailOptions = {
      from: "jeffreyleeprg2@gmail.com", // sender address
      to: emailData.receipients, // list of receivers
      subject: emailData.subject, // Subject line
      text: emailData.text, // plain text body
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    next();
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

module.exports = sendEmailMiddleware;
