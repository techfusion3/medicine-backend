const mongoose = require('mongoose');

const unsubscribedEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  unsubscribedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UnsubscribedEmail', unsubscribedEmailSchema);
