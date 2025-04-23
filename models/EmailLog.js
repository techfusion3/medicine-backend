const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true 
  },
  medicineName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  timeSent: { 
    type: String, // Format: "HH:MM"
    required: true, 
    trim: true 
  },
  sentAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Index for faster lookup by time
emailLogSchema.index({ timeSent: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
