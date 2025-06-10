const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Exclude password from the response
        const { password, ...userProfile } = user;
        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    const { name, profilePicture, phoneNumber } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUserData = {
            name: name || user.name,
            profilePicture: profilePicture || user.profilePicture,
            phoneNumber: phoneNumber || user.phoneNumber,
        };

        const updatedUser = await User.update(userId, updatedUserData);
        const { password, ...userProfile } = updatedUser; 
        res.json(userProfile);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email; // Assuming email is stored in req.user from auth middleware

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    try {
        // Need to fetch the user by email or ID to get the current password hash
        const user = await User.findByEmail(userEmail); // Or User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        await User.updatePassword(userId, newPassword); // updatePassword should handle hashing
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user by ID (Admin)
// @route   GET /api/users/admin/:id
// @access  Private/Admin
exports.adminGetUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userProfile } = user;
        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching user by ID (admin):', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/users/admin
// @access  Private/Admin
exports.adminGetAllUsers = async (req, res) => {
    try {
        // Basic implementation: In a real app, add pagination & filtering
        const users = await User.findAll(); 
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userProfile } = user;
            return userProfile;
        });
        res.json(usersWithoutPasswords);
    } catch (error) {
        console.error('Error fetching all users (admin):', error);
        res.status(500).json({ message: 'Server error' });
    }
};
