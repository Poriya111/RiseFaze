const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (the 'id' is in the payload)
      // Attach the user to the request object so we can access it in any protected route
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move on to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return; // Stop execution if token verification fails
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return; // Stop execution if no token is provided
  }
});

module.exports = { protect };