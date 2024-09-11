const nodemailer = require("nodemailer");
require("dotenv").config();
const{USER, PASSWORD} = process.env
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});



const sendVerification = async (email, verificationToken) => {
  const msg = {
    from: '"Veryfication MyCompany " <noreply@mycompany.com>',
    to: email,
    subject: `Verification for Registration`,
    html: `
    <p>Click below to verify:
    <a href="http://localhost:3000/api/users/verify/${verificationToken}">Verify Email</a></p>
    
  `,
  };
  try {
    const response = await transporter.sendMail(msg);
    console.log("sendVerification response:", response);
  } catch (err) {
    console.log("sendVerification error:", err);
  }
};

module.exports = sendVerification;
