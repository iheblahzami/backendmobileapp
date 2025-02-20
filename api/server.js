require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors({
  origin: "http://192.168.100.176",  // Make sure this matches your frontend URL
  methods: "POST",
  allowedHeaders: ["Content-Type"],
}));
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
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
  <h2 style="text-align: center; color: #4CAF50; font-size: 24px; margin-bottom: 20px;">
    <i class="fas fa-calendar-check" style="margin-right: 10px;"></i>
    New Booking Received
  </h2>

  <div style="border-top: 2px solid #4CAF50; padding-top: 20px;">
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <i class="fas fa-user" style="color: #4CAF50; margin-right: 10px;"></i>
      <p style="font-size: 16px; line-height: 1.6;">
        <strong>Name:</strong> ${name}
      </p>
    </div>

    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <i class="fas fa-briefcase" style="color: #4CAF50; margin-right: 10px;"></i>
      <p style="font-size: 16px; line-height: 1.6;">
        <strong>Profession:</strong> ${profession}
      </p>
    </div>

    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <i class="fas fa-hand-holding-heart" style="color: #4CAF50; margin-right: 10px;"></i>
      <p style="font-size: 16px; line-height: 1.6;">
        <strong>Need:</strong> ${need}
      </p>
    </div>

    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <i class="fas fa-map-marker-alt" style="color:rgb(16, 78, 202); margin-right: 10px;"></i>
      <p style="font-size: 16px; line-height: 1.6;">
        <strong>Address:</strong> ${address}
      </p>
    </div>

    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <i class="fas fa-calendar-day" style="color:rgb(13, 25, 196); margin-right: 10px;"></i>
      <p style="font-size: 16px; line-height: 1.6;">
        <strong>Date:</strong> ${date}
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px;">
    <button style="background-color:rgb(224, 16, 16); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
      Confirm Booking
    </button>
  </div>
</div>
    `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

// API Route for sending emails
app.post("/api/send-email", async (req, res) => {
  try {
    console.log("Received booking details:", req.body); // Log received data
    await sendEmail(req.body);
    const response = { success: true, message: "Email sent successfully" };
    console.log("Response being sent:", response); // Log the response
    res.status(200).json(response); // Send the correct JSON response
  } catch (error) {
    console.error("Error sending email:", error); // Log the error
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
