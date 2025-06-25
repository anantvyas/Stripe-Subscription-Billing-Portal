const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/billing-history
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // First find the customer in Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ message: 'No Stripe customer found' });
    }

    const customerId = customers.data[0].id;

    // Now get invoices
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 20,
    });

    res.json({ invoices: invoices.data });
  } catch (err) {
    console.error('Error fetching billing history:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;