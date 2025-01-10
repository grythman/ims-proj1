const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    evaluator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    type: {
        type: String,
        enum: ['mentor', 'teacher', 'self'],
        required: true
    },
    criteria: [{
        name: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        weight: {
            type: Number,
            default: 1
        },
        comments: String
    }],
    skills: [{
        name: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comments: String
    }],
    performance: {
        technicalSkills: {
            rating: Number,
            comments: String
        },
        softSkills: {
            rating: Number,
            comments: String
        },
        workEthic: {
            rating: Number,
            comments: String
        },
        teamwork: {
            rating: Number,
            comments: String
        },
        communication: {
            rating: Number,
            comments: String
        }
    },
    overallRating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    strengths: [String],
    areasForImprovement: [String],
    comments: String,
    recommendations: String,
    goals: [{
        description: String,
        deadline: Date,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        }
    }],
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed', 'approved'],
        default: 'draft'
    },
    reviewedBy: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: Date,
        comments: String
    },
    period: {
        startDate: Date,
        endDate: Date
    },
    attachments: [{
        name: String,
        file: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for weighted average score
evaluationSchema.virtual('weightedScore').get(function() {
    if (!this.criteria || this.criteria.length === 0) return 0;
    
    const totalWeight = this.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    const weightedSum = this.criteria.reduce((sum, criterion) => {
        return sum + (criterion.score * criterion.weight);
    }, 0);
    
    return (weightedSum / totalWeight).toFixed(2);
});

// Indexes for common queries
evaluationSchema.index({ student: 1, type: 1 });
evaluationSchema.index({ evaluator: 1 });
evaluationSchema.index({ internship: 1 });
evaluationSchema.index({ 'period.startDate': -1 });
evaluationSchema.index({ status: 1 });

module.exports = mongoose.model('Evaluation', evaluationSchema); 