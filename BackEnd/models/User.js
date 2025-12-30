const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rfcBalance: { type: Number, default: 500 },
    netWorth: { type: Number, default: 500 },
    ownedAssets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
      },
    ],
    previousNetWorth: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);