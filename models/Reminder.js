const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
  },
  times: {
    type: [String], // ["08:00", "13:00", "20:00"]
    required: true,
  },
  dosages: {
    type: [String], // ["1", "1", "2"]
    required: true,
  },
  timesPerDay: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Better to use ObjectId for user reference
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
