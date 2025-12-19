const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getNotifications,
  getPerformanceData,
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/notifications', protect, getNotifications);
router.get('/performance', protect, getPerformanceData);

module.exports = router;