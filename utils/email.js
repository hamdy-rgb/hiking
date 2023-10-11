const transporter = require("../config/email");
const { logger } = require("../config/winston");

const sendEmail = async (data) => {
  const { recipient, subject, htmlBody } = data;

  const textBody = htmlBody
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<(?:.|\n)*?>/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/g, "\n");

  const mailOptions = {
    from: "info@hiking.com",
    to: recipient,
    subject,
    text: textBody,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    return "Email sent successfully.";
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
  }
};

module.exports = {
  sendEmail,
};
