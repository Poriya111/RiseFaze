const express = require('express');
const router = express.Router();
const { getExploreAssets, buyAsset, sellAsset } = require('../controllers/assetController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.get('/explore', getExploreAssets);
router.post('/:id/buy', protect, buyAsset);
router.post('/:id/sell', protect, sellAsset);
module.exports = router;