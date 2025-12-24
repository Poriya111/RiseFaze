const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * @desc    Get all assets available for purchase from the bank
 * @route   GET /api/assets/explore
 * @access  Public
 */
const getExploreAssets = asyncHandler(async (req, res) => {
  // Find all assets that do not have an owner
  const assets = await Asset.find({ owner: null });
  res.status(200).json(assets);
});

/**
 * @desc    Purchase an asset from the bank
 * @route   POST /api/assets/:assetId/buy
 * @access  Private
 */
const buyAsset = asyncHandler(async (req, res) => {
  // Get the io instance from the request object (injected by middleware)
  const io = req.app.get('io');
  const userSockets = req.app.get('userSockets');
  const assetId = req.params.assetId;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const asset = await Asset.findById(assetId).session(session);
    const user = await User.findById(userId).session(session);

    if (!asset || asset.owner !== null) {
      res.status(404);
      throw new Error('Asset not found or already owned.');
    }

    if (user.rfcBalance < asset.price) {
      // Send a specific JSON response for insufficient funds and stop execution.
      return res.status(400).json({ message: 'Insufficient rfcBalance.' });
    }

    // Update user: subtract cost, add asset to owned list
    user.rfcBalance -= asset.price;
    user.ownedAssets.push(assetId);
    await user.save({ session });

    // Update asset: set new owner
    asset.owner = userId;
    await asset.save({ session });

    await session.commitTransaction();

    // --- WebSocket Emissions ---
    // 1. Broadcast to all users that this asset is now sold
    io.emit('asset-sold', { assetId: asset._id });

    // 2. Send a targeted update to the user who bought the asset
    const userSocketId = userSockets[userId];
    if (userSocketId) {
      // We need to fetch the user's full, updated data to send back
      const updatedUser = await User.findById(userId).populate('ownedAssets');
      const rank = (await User.countDocuments({ netWorth: { $gt: updatedUser.netWorth } })) + 1;
      io.to(userSocketId).emit('user-data-updated', { ...updatedUser.toObject(), globalRank: rank });
    }

    res.status(200).json({ message: 'Asset purchased successfully', assetId });
  } catch (error) {
    await session.abortTransaction();
    // Only set 500 if a more specific status code hasn't already been set
    if (res.statusCode === 200) res.status(500);
    throw new Error(`Purchase transaction failed: ${error.message}`);
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Sell an asset back to the bank
 * @route   POST /api/assets/:assetId/sell
 * @access  Private
 */
const sellAsset = asyncHandler(async (req, res) => {
  // Get the io instance from the request object
  const io = req.app.get('io');
  const userSockets = req.app.get('userSockets');
  const { customPrice } = req.body;
  const assetId = req.params.assetId;
  const userId = req.user.id;

  // 1. Validate input
  if (typeof customPrice !== 'number' || customPrice <= 0) {
    res.status(400);
    throw new Error('Invalid custom price provided.');
  }

  // 5. Start transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch documents within the session to lock them for the transaction
    const assetInTransaction = await Asset.findById(assetId).session(session);
    const userInTransaction = await User.findById(userId).session(session);

    if (!assetInTransaction) {
      throw new Error('Asset not found.');
    }
    if (!userInTransaction) {
      throw new Error('User not found.');
    }
    if (!assetInTransaction.owner || assetInTransaction.owner.toString() !== userId) {
      throw new Error('User does not own this asset.');
    }

    const maxSellPrice = assetInTransaction.price * 1.05;
    if (customPrice > maxSellPrice) {
      throw new Error(
        `Custom price exceeds the 5% profit margin. Maximum price: ${maxSellPrice.toFixed(
          2
        )}`
      );
    }

    const originalPrice = assetInTransaction.price; // Capture original price for calculations
    const profit = customPrice - originalPrice;

    // Update user's balance and net worth
    userInTransaction.rfcBalance += customPrice;
    userInTransaction.netWorth += profit; // Net worth increases by the profit made
    userInTransaction.ownedAssets.pull(assetId); // Remove asset from user's list
    await userInTransaction.save({ session });

    // Update asset: return it to the bank with a new price
    assetInTransaction.owner = null;
    assetInTransaction.lastSoldBy = userId; // Track who sold it
    assetInTransaction.lastSoldAt = new Date(); // Track when it was sold
    const bankMargin = originalPrice * 0.02; // The bank takes a 2% margin on the original price
    assetInTransaction.price = Math.round(customPrice + bankMargin); // Set the new market price, rounded to the nearest RFC
    await assetInTransaction.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // --- WebSocket Emission ---
    // Send a targeted update to the user who sold the asset
    const userSocketId = userSockets[userId];
    if (userSocketId) {
      // We need to fetch the user's full, updated data to send back
      const updatedUser = await User.findById(userId).populate('ownedAssets');
      const rank = (await User.countDocuments({ netWorth: { $gt: updatedUser.netWorth } })) + 1;
      io.to(userSocketId).emit('user-data-updated', { ...updatedUser.toObject(), globalRank: rank });
    }

    res.status(200).json({
      message: 'Asset sold successfully!',
      soldAsset: {
        _id: assetInTransaction._id,
        name: assetInTransaction.name,
      },
      newBalance: userInTransaction.rfcBalance,
      newNetWorth: userInTransaction.netWorth,
    });
  } catch (error) {
    // If anything fails, abort the transaction
    await session.abortTransaction();
    res.status(400); // Set a bad request status for client-side errors
    // Throw a more specific error to be caught by the async handler
    throw new Error(`Transaction failed: ${error.message}`);
  } finally {
    // End the session
    session.endSession();
  }
});

// In a real implementation, you would also have buyAsset, getExploreAssets, etc.
// For now, we are just implementing the sell functionality.

module.exports = {
  getExploreAssets,
  buyAsset,
  sellAsset,
};