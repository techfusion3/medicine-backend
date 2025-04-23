const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Remove the web-push logic
// Since we're no longer using push notifications, the below code is not needed:
// const webpush = require('web-push');

// Save push subscription to the database
router.post('/', async (req, res) => {
  const { userId, subscription } = req.body;

  if (!userId || !subscription) {
    return res.status(400).send('Missing userId or subscription');
  }

  try {
    const user = await User.findById(userId);
    if (user) {
      // If you're no longer using push subscription, you may want to remove the line below:
      // user.pushSubscription = subscription;  // This line is no longer necessary.

      await user.save();
      res.status(200).send('Successfully received the data');  // You can update the response to something more appropriate.
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('[❌ Subscription Save Error]', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
