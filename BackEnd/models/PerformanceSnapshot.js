const mongoose = require('mongoose');

const performanceSnapshotSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    netWorth: {
      type: Number,
      required: true,
    },
    globalRank: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // We only care about when it was created
);

module.exports = mongoose.model('PerformanceSnapshot', performanceSnapshotSchema);