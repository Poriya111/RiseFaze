const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset.js');

// @desc    Get all assets available for purchase
// @route   GET /api/assets/explore
// @access  Public
const getExploreAssets = asyncHandler(async (req, res) => {
  // Find assets with no owner (i.e., sold by the bank)
  const assets = await Asset.find({ owner: null });
  res.status(200).json(assets);
});

module.exports = { getExploreAssets };