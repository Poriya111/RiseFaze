const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const Notification = require('../models/Notification.js');
const PerformanceSnapshot = require('../models/PerformanceSnapshot.js');

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Please add all fields' });
    return;
  }

  // Check if email exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Check if username exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400).json({ message: 'Username is already taken' });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  // Check password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Get current user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // We already have the user from the protect middleware
  const user = await req.user.populate('ownedAssets');

  // Calculate the user's global rank
  // The rank is the number of users with a higher net worth, plus one.
  const rank = (await User.countDocuments({ netWorth: { $gt: user.netWorth } })) + 1;

  // --- Calculate Net Worth Change ---
  const netWorthChange = user.netWorth - user.previousNetWorth;

  // --- Update Previous Net Worth for Next Session ---
  // If the user's data hasn't been updated in the last hour, we'll snapshot the current
  // net worth as the new 'previous' value for the *next* time they load the dashboard.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (new Date(user.updatedAt) < oneHourAgo) {
    user.previousNetWorth = user.netWorth;
    // We save this without triggering other hooks or logic.
    await user.save();
  }

  // Convert to a plain object to add the dynamic fields for the response
  const userObject = user.toObject();
  // Add the calculated rank to the user object
  userObject.globalRank = rank;
  userObject.netWorthChange = netWorthChange;

  res.status(200).json(userObject);
});

/**
 * @desc    Get recent notifications for the logged-in user
 * @route   GET /api/users/notifications
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const notifications = await Notification.find({
    user: req.user.id,
    createdAt: { $gte: twentyFourHoursAgo },
  }).sort({ createdAt: -1 }); // Sort by most recent

  res.status(200).json(notifications);
});

/**
 * @desc    Get performance data for the chart
 * @route   GET /api/users/performance
 * @access  Private
 */
const getPerformanceData = asyncHandler(async (req, res) => {
  const { timeframe } = req.query; // 'oneHour', 'twelveHours', 'daily', 'monthly'
  let startDate;
  let groupBy;

  switch (timeframe) {
    case 'oneHour': // Last hour
      startDate = new Date(Date.now() - 1 * 60 * 60 * 1000);
      groupBy = { $minute: '$createdAt' }; // Group by minute for fine detail
      break;
    case 'twelveHours': // Last 12 hours
      startDate = new Date(Date.now() - 12 * 60 * 60 * 1000);
      groupBy = { $hour: '$createdAt' };
      break;
    case 'daily': // Last 7 days
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      groupBy = { $dayOfYear: '$createdAt' };
      break;
    case 'monthly': // Last 6 months
      startDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      groupBy = { $week: '$createdAt' }; // Group by week for monthly view
      break;
    default:
      res.status(400).json({ message: 'Invalid timeframe' });
      return;
  }

  const snapshots = await PerformanceSnapshot.aggregate([
    // 1. Filter for the current user and the correct time range
    {
      $match: {
        user: req.user._id,
        createdAt: { $gte: startDate },
      },
    },
    // 2. Sort by date to get the latest record in each group
    { $sort: { createdAt: -1 } },
    // 3. Group by the calculated interval (hour, day, week)
    {
      $group: {
        _id: groupBy,
        // Get the first document in each group (which is the latest due to sorting)
        doc: { $first: '$$ROOT' },
      },
    },
    // 4. Restore the document structure
    { $replaceRoot: { newRoot: '$doc' } },
    // 5. Sort again by date to have a proper timeline for the chart
    { $sort: { createdAt: 1 } },
  ]);

  // Format data for Chart.js
  const labels = snapshots.map(s => {
    const date = new Date(s.createdAt);
    if (timeframe === 'oneHour' || timeframe === 'twelveHours') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (timeframe === 'daily') return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  });
  const netWorthData = snapshots.map(s => s.netWorth);
  const rankData = snapshots.map(s => s.globalRank);

  res.status(200).json({
    netWorth: { labels, values: netWorthData },
    rank: { labels, values: rankData },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getNotifications,
  getPerformanceData,
};