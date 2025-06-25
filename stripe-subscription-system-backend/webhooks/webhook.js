const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment'); // Make sure this path is correct

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook event received:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    console.log('✔ Processing checkout.session.completed');

    const session = event.data.object;

    const customerId = session.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = customer.email;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    const priceId = lineItems.data[0].price.id;

    let newStatus = 'free';
    let plan = 'Free';
    let amount = 0;

    if (priceId === process.env.BASIC_PRICE_ID) {
      newStatus = 'basic';
      plan = 'Basic';
      amount = 5;
    } else if (priceId === process.env.PRO_PRICE_ID) {
      newStatus = 'pro';
      plan = 'Pro';
      amount = 15;
    }

    const user = await User.findOneAndUpdate(
      { email: customerEmail },
      {
        $set: {
          subscriptionStatus: newStatus,
          subscriptionStartDate: Date.now(),
        },
      },
      { new: true }
    );

    if (user) {
      console.log(`✅ Updated user ${user.email} to ${newStatus} plan`);
      res.json({ received: true });

      // ✅ Save payment to DB
    await Payment.create({
        userId: user._id,
        plan,
        amount,
        createdAt: new Date(),
      });

      console.log(`Payment saved for ${user.email}: Plan ${plan} ($${amount})`);
    } else {
      console.log(`⚠ No user found with email: ${customerEmail}`);
    }
  }

  
};