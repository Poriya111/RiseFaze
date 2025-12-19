const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * @desc    Get the global leaderboard
 * @route   GET /api/leaderboard
 * @access  Public
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  // Fetch top 100 users, sorted by netWorth in descending order
  const users = await User.find()
    .sort({ netWorth: -1 })
    .limit(100)
    .select('username netWorth');

  // Map the results to add a rank
  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    netWorth: user.netWorth,
  }));

  res.status(200).json(leaderboard);
});

module.exports = { getLeaderboard };