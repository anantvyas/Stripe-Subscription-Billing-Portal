const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); 

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vyas.anant1997@gmail.com';


// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      subscriptionStatus: 'free',
      emailVerified: false,
      emailVerificationToken: verificationToken,
    });

    // Send verification email
    const link = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const html = `
      <h2>Welcome to the platform, ${name}!</h2>
      <p>Please verify your email by clicking the link below within 30 minutes:</p>
      <a href="${link}">${link}</a>
    `;

    await sendEmail(email, 'Verify Your Email', html);

    // ⏳ Schedule deletion if not verified within 30 mins
    setTimeout(async () => {
      const user = await User.findById(newUser._id);
      if (user && !user.emailVerified) {
        await User.findByIdAndDelete(newUser._id);
        console.log(`🗑 Deleted unverified user: ${user.email}`);
      }
    }, 30 * 60 * 1000); // 30 minutes

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify.' });
  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Admin login is not allowed here' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // ✅ Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // ✅ Successful login response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /api/auth/update-profile
router.put('/update-profile', async (req, res) => {
  const { userId, name, password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) {
      user.name = name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
  console.log('forgot-password route hit');
  const { email } = req.body;

  // console.log(`🔗 Forgot password request received for email: ${email}`) ;

  try {

    console.log(`🔗 Forgot password request received for email: ${email}`) ;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');

    // Save token + expiry in db
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset link via email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `
      <h2>Reset your password</h2>
      <p>Click the link below to reset your password. The link is valid for 1 hour:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    console.log(`🔗 Reset link: http://localhost:3000/reset-password/${token}`);

    await sendEmail(email, 'Password Reset Request', html);

    res.json({ message: 'Password reset link has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

});

//GET /api/auth/me/:userId
  router.get('/me/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionStartDate: user.subscriptionStartDate,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  //DELETE /api/auth/delete/:userId
router.delete('/delete/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting User :', err);
    res.status(500).json({ message:'Server error'});
  }
});



// ✅ VERIFY EMAIL ROUTE
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ emailVerificationToken: req.params.token });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });


    if (user.emailVerified) {
      return res.status(200).json({ message: 'Email already verified' });
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

module.exports = router;