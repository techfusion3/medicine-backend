const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  times: {
    type: [String],  // Array of time strings
    required: true,
  },
  frequency: {
    type: String,  // "Once daily", "Every 6 hours", etc.
    required: true,
  },
  reminder: {
    type: Date,
    default: Date.now,
  },
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
