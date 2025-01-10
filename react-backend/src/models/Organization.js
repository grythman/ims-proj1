const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: {
            type: String,
            required: true
        },
        state: String,
        country: {
            type: String,
            required: true
        },
        postalCode: String
    },
    contact: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        website: String
    },
    industry: {
        type: String,
        required: true
    },
    employeeCount: {
        type: Number,
        min: 0
    },
    logo: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    isAcceptingInterns: {
        type: Boolean,
        default: true
    },
    internshipPrograms: [{
        name: String,
        description: String,
        duration: Number, // in weeks
        positions: Number,
        requirements: [String],
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    mentors: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        department: String,
        position: String,
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    documents: [{
        name: String,
        type: {
            type: String,
            enum: ['agreement', 'policy', 'guidelines', 'other']
        },
        file: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
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
organizationSchema.index({ name: 1 });
organizationSchema.index({ 'contact.email': 1 });
organizationSchema.index({ status: 1, isAcceptingInterns: 1 });
organizationSchema.index({ industry: 1 });

// Virtual for average rating
organizationSchema.virtual('averageRating').get(function() {
    if (this.ratings && this.ratings.length > 0) {
        const sum = this.ratings.reduce((total, rating) => total + rating.score, 0);
        return (sum / this.ratings.length).toFixed(1);
    }
    return 0;
});

// Ensure virtuals are included in JSON output
organizationSchema.set('toJSON', { virtuals: true });
organizationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Organization', organizationSchema); 