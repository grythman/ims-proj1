const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship'
    },
    type: {
        type: String,
        enum: ['preliminary', 'weekly', 'monthly', 'final'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed', 'approved', 'needs_revision', 'rejected'],
        default: 'draft'
    },
    file: {
        type: String,
        trim: true
    },
    feedback: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    revisions: [{
        version: Number,
        content: String,
        file: String,
        submittedAt: {
            type: Date,
            default: Date.now
        },
        comments: String
    }],
    submissionDate: {
        type: Date,
        default: Date.now
    },
    dueDate: Date,
    reviewedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedAt: Date,
        status: String,
        comments: String
    }],
    tags: [String],
    attachments: [{
        filename: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes for common queries
reportSchema.index({ student: 1, type: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ submissionDate: -1 });
reportSchema.index({ 'reviewedBy.user': 1 });

module.exports = mongoose.model('Report', reportSchema); 