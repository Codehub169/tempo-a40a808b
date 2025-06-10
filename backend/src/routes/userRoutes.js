const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  adminGetAllUsers,
  adminGetUserById,
  // Placeholder for adminUpdateUser, adminDeleteUser if needed later
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires login)
router.get('/profile', protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (requires login)
router.put('/profile', protect, updateUserProfile);

// @desc    Change user password
// @route   PATCH /api/users/profile/change-password
// @access  Private (requires login)
router.patch('/profile/change-password', protect, changePassword);

// --- Admin Routes ---
// All routes below are protected and require admin privileges

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/users
// @access  Private/Admin
router.get('/admin/users', protect, admin, adminGetAllUsers);

// @desc    Get user by ID (Admin)
// @route   GET /api/users/admin/users/:id
// @access  Private/Admin
router.get('/admin/users/:id', protect, admin, adminGetUserById);

// Placeholder for future admin actions on users, e.g.:
// router.put('/admin/users/:id', protect, admin, adminUpdateUser);
// router.delete('/admin/users/:id', protect, admin, adminDeleteUser);

module.exports = router;
