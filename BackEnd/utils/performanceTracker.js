const User = require('../models/User');
const PerformanceSnapshot = require('../models/PerformanceSnapshot');

const recordPerformanceSnapshots = async () => {
  console.log('Running performance tracker: Recording user snapshots...');

  try {
    // Get all users, sorted by net worth to calculate rank efficiently
    const users = await User.find().sort({ netWorth: -1 }).select('_id netWorth');

    const snapshots = users.map((user, index) => {
      const rank = index + 1;
      return {
        user: user._id,
        netWorth: user.netWorth,
        globalRank: rank,
      };
    });

    if (snapshots.length > 0) {
      await PerformanceSnapshot.insertMany(snapshots);
      console.log(`Performance tracker: Successfully recorded ${snapshots.length} snapshots.`);
    }
  } catch (error) {
    console.error('Error recording performance snapshots:', error);
  }
};

const startPerformanceTracker = () => {
  // Run once on startup, then every 5 minutes
  recordPerformanceSnapshots();
  setInterval(recordPerformanceSnapshots, 5 * 60 * 1000); // 5 minutes
};

module.exports = { startPerformanceTracker };