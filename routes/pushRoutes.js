const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Save push subscription
router.post('/save-subscription', async (req, res) => {
  const { userId, subscription } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { pushSubscription: subscription });
    res.status(200).json({ success: true, message: 'Subscription saved' });
  } catch (err) {
    console.error('[❌ Failed to Save Subscription]', err);
    res.status(500).json({ success: false, message: 'Failed to save subscription' });
  }
});

module.exports = router;
