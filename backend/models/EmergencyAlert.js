const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  contacts: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EmergencyAlert', EmergencyAlertSchema);