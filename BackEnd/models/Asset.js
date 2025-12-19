const mongoose = require('mongoose');

const assetSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    emoji: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means it's owned by the bank
    },
    // --- NEW FIELD FOR DYNAMIC PRICING ---
    priceBehavior: {
      type: String,
      enum: ['appreciate', 'depreciate', 'fluctuate', 'stable'],
      default: 'stable',
    },
    // --- NEW FIELDS FOR INCOME GENERATION ---
    generatesIncome: {
      type: Boolean,
      default: false,
    },
    incomeIntervalSeconds: {
      type: Number,
      default: null,
    },
    incomeYieldPercentage: {
      type: Number,
      default: 0, // e.g., 2 would mean 2%
    },
    incomeDetails: { type: String, default: null },
    // --- NEW FIELDS FOR COOLDOWN ---
    lastSoldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastSoldAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Asset', assetSchema);