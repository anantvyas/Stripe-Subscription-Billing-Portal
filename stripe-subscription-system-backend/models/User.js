const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  subscriptionStatus: {
    type: String,
    enum: ['free', 'basic', 'pro'],
    default: 'free',
  },

  subscriptionStartDate: {
    type: Number,

  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  
  resetToken: String,
  resetTokenExpiry: Date,

  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
},

 { timestamps: true });

module.exports = mongoose.model('User', userSchema);
