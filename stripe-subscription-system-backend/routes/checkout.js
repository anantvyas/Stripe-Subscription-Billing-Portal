const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');
const User = require('../models/User');
const Payment = require('../models/Payment'); // ✅ Added

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { email, priceId } = req.body;

  console.log("📦 Received checkout request");
  console.log("✅ Email:", email);
  console.log("✅ Price ID:", priceId);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}success`,
      cancel_url: `${process.env.FRONTEND_URL}cancel`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe Error:", err.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

// ✅ Stripe webhook route
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const plan = session.display_items?.[0]?.plan?.nickname || 'Pro Plan';
    const amount = session.amount_total ? session.amount_total / 100 : 0; // in dollars

    try {
      const payment = new Payment({
        userId,
        amount,
        plan,
        date: new Date()
      });
      await payment.save();
      console.log('✅ Payment saved to DB');
    } catch (error) {
      console.error('❌ Error saving payment:', error);
    }
  }

  res.send({ received: true });
});

module.exports = router;