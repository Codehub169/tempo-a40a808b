const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model with create, findByEmail, findById methods

// Utility to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Check if user already exists
  const userExists = await User.findByEmail(email);
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: role || 'buyer', // Default to 'buyer' if not specified
  };

  const createdUser = await User.create(newUser);

  if (createdUser) {
    // Exclude password from the response
    const { password, ...userWithoutPassword } = createdUser;
    res.status(201).json({
      ...userWithoutPassword,
      token: generateToken(createdUser.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user by email
  const user = await User.findByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    // Exclude password from the response
    const { password, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      token: generateToken(user.id),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  register,
  login,
  generateToken, // Exporting if needed elsewhere, though typically used internally
};
