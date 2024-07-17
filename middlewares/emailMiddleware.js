const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jeffreyleeprg2@gmail.com",
    pass: "cuhmvmdqllulsucg",
  },
});

const sendEmailMiddleware = async (req, res, next) => {
  try {
    //const transporter = await createTransporter();
    const mailOptions = {
      from: "jeffreyleeprg2@gmail.com", // sender address
      to: "raeannezou@gmail.com", // list of receivers (req.body.receipients)
      subject: "Signing Out", // Subject line (req.body.subject)
      text: "You've been signed out", // plain text body (req.body.text)
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
