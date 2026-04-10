const express = require('express');
const multer = require('multer');
const path = require('path');
const Note = require('../models/Note');
const User = require('../models/User');
const router = express.Router();

// Import the global auth middleware
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and PDF files are allowed'));
        }
    }
});

// Upload note
router.post('/upload', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const { title, subject, course, semester, description } = req.body;

        const files = req.files.map(file => ({
            fileUrl: `/uploads/${file.filename}`,
            fileName: file.originalname
        }));

        const note = new Note({
            title,
            subject,
            course,
            semester,
            description,
            files,
            uploadedBy: req.user._id
        });

        await note.save();

        res.status(201).json({
            message: 'Note uploaded successfully',
            note: {
                id: note._id,
                title: note.title,
                subject: note.subject,
                course: note.course,
                semester: note.semester,
                description: note.description,
                status: note.status,
                createdAt: note.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all approved notes (for students)
router.get('/approved', async (req, res) => {
    try {
        const { subject, course, semester, search } = req.query;
        let query = { status: 'approved' };

        if (subject) {
            query.subject = new RegExp(subject, 'i');
        }

        if (course) {
            query.course = course;
        }

        if (semester) {
            query.semester = new RegExp(semester, 'i');
        }

        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { subject: new RegExp(search, 'i') },
                { course: new RegExp(search, 'i') },
                { semester: new RegExp(search, 'i') }
            ];
        }

        const notes = await Note.find(query)
            .populate('uploadedBy', 'username')
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's own notes
router.get('/user', auth, async (req, res) => {
    try {
        const notes = await Note.find({ uploadedBy: req.user._id })
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all notes (for admins)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { status, subject, course, semester, search } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        if (subject) {
            query.subject = new RegExp(subject, 'i');
        }

        if (course) {
            query.course = course;
        }

        if (semester) {
            query.semester = new RegExp(semester, 'i');
        }

        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { subject: new RegExp(search, 'i') },
                { course: new RegExp(search, 'i') },
                { semester: new RegExp(search, 'i') }
            ];
        }

        const notes = await Note.find(query)
            .populate('uploadedBy', 'username email')
            .populate('reviewedBy', 'username')
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Approve/Reject note (admin only)
router.patch('/:id/review', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { status } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be approved or rejected.' });
        }

        const note = await Note.findByIdAndUpdate(
            req.params.id,
            {
                status,
                reviewedBy: req.user._id,
                reviewedAt: new Date()
            },
            { new: true }
        ).populate('uploadedBy', 'username email');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({
            message: `Note ${status} successfully`,
            note
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's uploaded notes
router.get('/my-notes', async (req, res) => {
    try {
        const notes = await Note.find({ uploadedBy: req.user._id })
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
