const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: {
      values: ['student', 'teacher', 'mentor', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'student'
  },
  studentId: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  department: {
    type: String,
    enum: {
      values: ['computer_science', 'information_systems', 'software_engineering', 'data_science'],
      message: '{VALUE} is not a valid department'
    },
    required: function() {
      return this.role === 'student';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add validation middleware
userSchema.pre('validate', function(next) {
  if (this.role === 'student') {
    if (!this.studentId) {
      this.invalidate('studentId', 'Student ID is required for students');
    }
    if (!this.department) {
      this.invalidate('department', 'Department is required for students');
    }
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ studentId: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);

module.exports = User; 