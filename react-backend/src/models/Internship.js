const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    position: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    progress: [{
        date: {
            type: Date,
            default: Date.now
        },
        description: String,
        type: {
            type: String,
            enum: ['task', 'milestone', 'note']
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            required: true
        },
        notes: String
    }],
    evaluations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation'
    }],
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for common queries
internshipSchema.index({ student: 1, status: 1 });
internshipSchema.index({ company: 1, status: 1 });
internshipSchema.index({ supervisor: 1 });

module.exports = mongoose.model('Internship', internshipSchema); 