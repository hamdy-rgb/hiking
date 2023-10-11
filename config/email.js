const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // process.env.EMAIL_HOST
  port: "2525", // process.env.EMAIL_PORT
  auth: {
    user: "2a87f34cf8b147", // process.env.EMAIL_ADDRESS
    pass: "08e0253b33008a", // process.env.EMAIL_PASSWORD
  },
});

module.exports = transporter;
