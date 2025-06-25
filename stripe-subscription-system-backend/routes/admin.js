const express = require('express');
const User = require('../models/User');
const router = express.Router();    
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ContactMessage = require('../models/ContactMessage');

//POST /api/admin/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Admin not Found!' });
        if (user.role !== 'admin') return res.status(403).json({ message: 'Not authorized as admin' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        console.error('Admin login error:',err);
        res.status(500).json({message: 'Server error'});
    }
});

// //GET ALL MESSAGES
// router.get('/messages', async (req, res) => {
//     try {
//         const messages = await ContactMessage.find().sort({ createdAt: -1 });
//         res.status(200).json(messages);
//     } catch (err) {
//         console.error('Error fetching messages:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// GET /api/contact/all — admin page
router.get('/messages/all', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/contact/mark-read/:id — mark as read
router.post('/messages/mark-read/:id', async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });

    msg.isRead = true;
    await msg.save();

    res.json({ message: 'Marked as read ✅' });
  } catch (err) {
    console.error('❌ Error marking as read:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//API for admin dashboard data

const Payment = require('../models/Payment'); // adjust path if needed



// Revenue by plan for pie chart
// routes/admin.js or wherever /dashboard-data is defined
router.get('/dashboard-data', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalRevenueAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 🟦 Payments Per Month (for Bar Chart)
    const paymentsPerMonth = await Payment.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInString: [
                  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: { $arrayElemAt: ['$$monthsInString', '$_id'] }
            }
          },
          count: 1,
        },
      },
      { $sort: { month: 1 } }
    ]);

    // 🟪 Revenue by Plan (for Pie Chart)
    const revenueByPlan = await Payment.aggregate([
      {
        $group: {
          _id: '$plan',
          amount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          plan: '$_id',
          amount: 1
        }
      }
    ]);

    res.json({
      totalUsers,
      totalPayments,
      totalRevenue,
      paymentsPerMonth,
      revenueByPlan
    });
  } catch (err) {
    console.error('Dashboard data error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
  
module.exports = router;