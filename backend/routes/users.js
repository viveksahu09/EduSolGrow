const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Get all users (admin only)
router.get('/all', auth, async (req, res) => {
    try {
        console.log('Users: Request to /api/users/all received');
        console.log('Users: Authenticated user:', req.user ? req.user.username : 'null');
        console.log('Users: User role:', req.user ? req.user.role : 'null');
        
        if (req.user.role !== 'admin') {
            console.log('Users: Access denied - user is not admin');
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        console.log('Users: Fetching all users from database');
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        console.log('Users: Successfully fetched', users.length, 'users');
        res.json(users);
    } catch (error) {
        console.log('Users: Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user role (admin only)
router.patch('/:id/role', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { role } = req.body;
        
        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Prevent admin from changing their own role
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'Cannot change your own role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Also delete all notes uploaded by this user
        const Note = require('../models/Note');
        await Note.deleteMany({ uploadedBy: req.params.id });

        res.json({ message: 'User and their notes deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Check if email is already taken by another user
        if (email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username, email },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Change password
router.patch('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Get user with password
        const user = await User.findById(req.user._id);
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete own account
router.delete('/account', auth, async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete user's notes
        const Note = require('../models/Note');
        await Note.deleteMany({ uploadedBy: userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
