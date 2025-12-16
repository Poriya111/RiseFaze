const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset.js');
const User = require('../models/User.js');

// @desc    Get all assets available for purchase
// @route   GET /api/assets/explore
// @access  Public
const getExploreAssets = asyncHandler(async (req, res) => {
  // Find assets with no owner (i.e., sold by the bank)
  const assets = await Asset.find({ owner: null });
  res.status(200).json(assets);
});

// @desc    Buy an asset
// @route   POST /api/assets/:id/buy
// @access  Private
const buyAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!asset) {
    res.status(404);
    throw new Error('Asset not found');
  }

  if (asset.owner) {
    res.status(400);
    throw new Error('Asset is already owned');
  }

  if (user.rfcBalance < asset.price) {
    res.status(400);
    throw new Error('Insufficient RFC balance');
  }

  // Perform the transaction
  user.rfcBalance -= asset.price;
  user.ownedAssets.push(asset._id);
  // Net worth doesn't change when buying with cash, it just converts form

  asset.owner = user._id;

  await user.save();
  await asset.save();

  res.status(200).json(asset);
});

// @desc    Sell an asset to the bank
// @route   POST /api/assets/:id/sell
// @access  Private
const sellAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!asset) {
    res.status(404).json({ message: 'Asset not found' });
    return;
  }

  // Verify the user actually owns this asset
  if (!asset.owner || asset.owner.toString() !== user._id.toString()) {
    res.status(401).json({ message: 'You do not own this asset' });
    return;
  }

  const sellPrice = asset.price * 0.95; // Bank buys at 95% of market value

  // Perform the transaction
  user.rfcBalance += sellPrice;
  user.netWorth -= (asset.price - sellPrice); // Net worth decreases by the 5% loss
  user.ownedAssets.pull(asset._id); // Remove asset from user's list

  asset.owner = null; // Return asset to the bank

  await user.save();
  await asset.save();

  res.status(200).json({ message: 'Asset sold successfully', user });
});

module.exports = { getExploreAssets, buyAsset, sellAsset };