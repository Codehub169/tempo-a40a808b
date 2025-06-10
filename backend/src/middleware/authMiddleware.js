const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model exists and has findById
const asyncHandler = require('express-async-handler');

// Middleware to protect routes by verifying JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      // Password exclusion should be handled by the User model or when sending responses,
      // not by a Mongoose-specific .select() method here.
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      // Ensure password is not part of req.user if User.findById doesn't handle it
      // This is a good place for a general check, though model or response formatting is preferred.
      if (req.user && req.user.password) {
        delete req.user.password;
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401);
      // Send a clearer message if the token is expired or malformed
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new Error('Not authorized, token failed or expired');
      } else {
        throw new Error('Not authorized, token failed');
      }
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to check for admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
