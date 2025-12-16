const express = require('express');
const router = express.Router();
const { getExploreAssets } = require('../controllers/assetController.js');

router.get('/explore', getExploreAssets);

module.exports = router;