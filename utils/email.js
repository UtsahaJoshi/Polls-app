const nodemailer = require("nodemailer");

const sendMails = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
  const mailOptions = {
    from: "Janamat Application <janamat.official@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  const result = await transporter.sendMail(mailOptions);
};
module.exports = sendMails;
