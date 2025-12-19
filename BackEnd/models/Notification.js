const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['success', 'error', 'info'],
      default: 'info',
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Notification', notificationSchema);