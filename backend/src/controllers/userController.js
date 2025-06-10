const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the 'protect' middleware.
  // User.findById in the model is expected to remove the password.
  const user = await User.findById(req.user.id);

  if (user) {
    // Defensively ensure password is not part of the response, 
    // even if the model should have handled it.
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, profilePicture, phoneNumber } = req.body;
  const userId = req.user.id;

  const updateData = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400);
      throw new Error('Name must be a non-empty string.');
    }
    updateData.name = name.trim();
  }

  if (profilePicture !== undefined) {
    // Allow null to clear profile picture, or it must be a non-empty string (URL)
    if (profilePicture !== null && (typeof profilePicture !== 'string' || profilePicture.trim() === '')) {
      res.status(400);
      throw new Error('Profile picture must be a valid URL string or null to remove.');
    }
    updateData.profilePicture = profilePicture === null ? null : profilePicture.trim();
  }

  if (phoneNumber !== undefined) {
    // Allow null to clear phone number, or it must be a non-empty string
    // Basic validation, more specific format validation could be added.
    if (phoneNumber !== null && (typeof phoneNumber !== 'string' || phoneNumber.trim() === '')) {
      res.status(400);
      throw new Error('Phone number must be a valid string or null to remove.');
    }
    updateData.phoneNumber = phoneNumber === null ? null : phoneNumber.trim();
  }

  if (Object.keys(updateData).length === 0) {
    // No valid fields to update were provided in the request body.
    // Fetch and return current user profile without making changes.
    const currentUser = await User.findById(userId);
    if (!currentUser) { // Should ideally not happen if JWT is valid and user exists
        res.status(404);
        throw new Error('User not found');
    }
    // User.findById removes password, so currentUser is safe to send.
    return res.json(currentUser); 
  }
  
  const updatedUser = await User.update(userId, updateData);

  if (updatedUser) {
    // User.update calls User.findById, which should remove password.
    // Defensive destructuring to ensure password is not sent.
    const { password, ...userProfile } = updatedUser;
    res.json(userProfile);
  } else {
    // This path might be hit if User.update returns null for some reason (e.g. user not found after update attempt)
    // or if an error wasn't thrown by the model for a failed update.
    res.status(404); // Or 500 if it implies an unexpected server state
    throw new Error('User not found or update failed');
  }
});

// @desc    Change user password
// @route   PATCH /api/users/profile/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new passwords');
  }

  // Need to fetch user with password for comparison
  const user = await User.findByIdWithPassword(req.user.id); 

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) { // Basic password strength check
    res.status(400);
    throw new Error('New password must be a string and at least 6 characters long');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await User.changePassword(req.user.id, hashedPassword);

  res.json({ message: 'Password changed successfully' });
});

// --- Admin Routes ---

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/users
// @access  Private/Admin
const adminGetAllUsers = asyncHandler(async (req, res) => {
  let page = parseInt(req.query.page, 10);
  let limit = parseInt(req.query.limit, 10);

  // Validate and set defaults for pagination parameters
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  } else if (limit > 100) { // Apply a max limit to prevent abuse
    limit = 100;
  }

  const usersData = await User.findAll({ page, limit });
  // User.findAll is expected to return users without passwords.
  res.json(usersData);
});

// @desc    Get user by ID (Admin)
// @route   GET /api/users/admin/users/:id
// @access  Private/Admin
const adminGetUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    // User.findById removes password.
    // Defensive destructuring.
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  adminGetAllUsers,
  adminGetUserById,
};
