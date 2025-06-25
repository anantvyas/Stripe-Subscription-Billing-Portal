const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage'); 

// POST /api/contact
router.post('/', async (req, res) => {
  console.log('📩 Contact route hit');

  const { name, email, message } = req.body;

  console.log('Body:', req.body);

  try {
    console.log(`📩 New contact message from ${name} <${email}>: ${message}`);

    //Save messages to DB first
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    console.log('✅ Message saved to database');

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Add in .env
        pass: process.env.EMAIL_PASS,  // Add in .env
      },
    });

    // Mail content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,  // Send to yourself
      subject: `New Contact Message from ${name}`,
      text: `
You have a new contact message:

Name: ${name}
Email: ${email}
Message:
${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent from ${email}`);

    // Save to DB
    await ContactMessage.create({ name, email, message });

    res.json({ message: 'Message received! Email sent ✅' });
  } catch (err) {
    console.error('❌ Error sending email:', err);
    res.status(500).json({ message: 'Server error — could not send email' });
  }
});


module.exports = router;