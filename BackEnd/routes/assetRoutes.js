const express = require('express');
const router = express.Router();
const {
  getExploreAssets,
  buyAsset,
  sellAsset,
} = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all assets for sale by the bank
// GET /api/assets/explore
router.get('/explore', getExploreAssets);

// Route to buy an asset
// POST /api/assets/:assetId/buy
router.post('/:assetId/buy', protect, buyAsset);

// Route to sell an asset
// POST /api/assets/:assetId/sell
router.post('/:assetId/sell', protect, sellAsset);

module.exports = router;