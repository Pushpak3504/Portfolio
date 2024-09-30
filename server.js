// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle contact form submissions
app.post("/contactUs", async (req, res) => {
  const { name, email, message } = req.body;

  // Setup Nodemailer transporter with environment variables
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Email from .env file
      pass: process.env.EMAIL_PASS, // Password from .env file
    },
  });

  // Define mail options
  const mailOptions = {
    from: email, // Sender's email from the form
    to: process.env.EMAIL_USER, // Your email (the recipient)
    subject: `New contact from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          .header { background-color: #1788ae; color: #ffffff; padding: 20px; text-align: center; font-size: 24px; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; font-size: 16px; line-height: 1.6; color: #333333; }
          .footer { text-align: center; color: #888888; padding: 10px; font-size: 12px; background-color: #f4f4f4; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">New Contact Message</div>
          <div class="content">
            <h2>Hello,</h2>
            <p>You have received a new message from the contact form on your website.</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p>Thank you for reviewing the message!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email" });
    }
    res.status(200).json({ message: "Email sent successfully" });
  });
});

// Start the server on the port from the .env file
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
