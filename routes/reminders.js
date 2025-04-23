const sendReminderEmail = require('../utils/email');
const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const User = require('../models/User'); // ✅ required to get user's email
const authMiddleware = require('../middleware/authMiddleware');

// Get all reminders for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });
    res.status(200).json(reminders);
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ message: 'Failed to fetch reminders' });
  }
});

// Add a new reminder
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    const reminder = new Reminder({
      ...rest,
      userId: req.user.id,
    });

    const savedReminder = await reminder.save();

    // ✅ Fetch the user from DB
    const user = await User.findById(req.user.id);

    if (!user) {
      console.warn('⚠️ User not found in DB');
    } else if (!user.email) {
      console.warn('⚠️ User email not defined');
    } else {
      // ✅ Log email for verification
      console.log('[📧 EMAIL TO]:', user.email);

      const subject = `⏰ Reminder: ${savedReminder.medicineName}`;
      const text = `Hello ${user.name || 'there'},\n\nIt's time to take your medicine: ${savedReminder.medicineName}\n\nScheduled Times: ${savedReminder.times.join(', ')}\nDosage: ${savedReminder.dosages.join(', ')}\nTimes per day: ${savedReminder.timesPerDay}`;

      // Try sending email
      try {
        // await sendReminderEmail(user.email, subject, text);
      } catch (emailErr) {
        console.error('Error sending email:', emailErr); // Log exact error
      }
    }

    res.status(201).json(savedReminder);
  } catch (err) {
    console.error('Error saving reminder:', err);
    res.status(500).json({ message: 'Error saving reminder' });
  }
});

// ❌ Delete a reminder
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted' });

  } catch (err) {
    console.error('Error deleting reminder:', err);
    res.status(500).json({ message: 'Error deleting reminder' });
  }
});

module.exports = router;
