require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Email sender function
const sendEmail = async (bookingDetails) => {
  const { name, need, address, date, profession } = bookingDetails;

  // Configure nodemailer transporter (Gmail example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.EMAIL_PASSWORD, // App password (not your actual password)
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL, // Set your recipient email
    subject: `New Booking for ${profession}`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Profession:</strong> ${profession}</p>
      <p><strong>Need:</strong> ${need}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Date:</strong> ${date}</p>
    `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

// API Route for sending emails
app.post("/send-email", async (req, res) => {
  try {
    await sendEmail(req.body);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
