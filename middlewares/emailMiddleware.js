const { createTransporter } = require("./auth");

const sendEmailMiddleware = async (req, res, next) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: req.body.receipients, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.text, // plain text body
      html: `<p>${req.body.html}</p>`, // html body
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    next(); // Pull to database
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

module.exports = sendEmailMiddleware;
