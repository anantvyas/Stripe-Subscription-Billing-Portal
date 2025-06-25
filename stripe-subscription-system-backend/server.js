const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

// ✅ FIRST — Load webhook FIRST with raw body BEFORE express.json()
const webhookHandler = require('./webhooks/webhook');
app.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use('/api/checkout/webhook',require('./routes/checkout'));

// ✅ THEN apply express.json() for all other routes
app.use(express.json());

//temporary
app.use((req, res, next) => {
  console.log(`📦 ${req.method} request to ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Checkout routes
const checkoutRoutes = require('./routes/checkout');
app.use('/api/checkout', checkoutRoutes);

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Billing routes
const billingRoutes = require('./routes/billing');
app.use('/api/billing-history', billingRoutes);

// Connect MongoDB
require('./config/db')();

// Test Route
app.get('/', (req, res) => {
  res.send('✅ Stripe Subscription System is running!');
});

// Success and Cancel routes
app.get('/success', (req, res) => {
  res.send('<h1> Payment Successful ! </h1><p>✅ Your subscription is now active.</p>');
});

app.get('/cancel', (req, res) => {
  res.send('<h1> Payment Cancelled ! </h1><p>❌ You have not been charged.</p>');
});

app.post('/test', (req, res) => {
  console.log('Test route hit:', req.body);
  res.json({ message: 'Test successful' });
});

//contact for admin routes
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});