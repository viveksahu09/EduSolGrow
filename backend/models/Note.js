const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
        enum: ['B.Tech', 'B.Sc', 'B.Com', 'B.A', 'M.Tech', 'M.Sc', 'M.Com', 'M.A', 'Other']
    },
    semester: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    files: [{
        fileUrl: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Note', noteSchema);
