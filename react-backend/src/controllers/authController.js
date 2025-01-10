const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Validation rules
const validateRegister = [
    check('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    check('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),
    check('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),
    check('role')
        .isIn(['student', 'teacher', 'mentor', 'admin'])
        .withMessage('Invalid role specified')
];

const validateLogin = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register controller
const register = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      role,
      studentId,
      department 
    } = req.body;

    console.log('Received registration data:', {
      username,
      email,
      firstName,
      lastName,
      role,
      studentId,
      department,
      hasPassword: !!password
    });

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      console.log('Registration validation failed:', { username, email, firstName, lastName });
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required',
        details: {
          username: !username ? 'Username is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          firstName: !firstName ? 'First name is required' : null,
          lastName: !lastName ? 'Last name is required' : null
        }
      });
    }

    // Validate student-specific fields
    if (role === 'student' && (!studentId || !department)) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Department are required for students',
        details: {
          studentId: !studentId ? 'Student ID is required' : null,
          department: !department ? 'Department is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ 
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    try {
      // Create user with all fields
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        ...(role === 'student' && { studentId, department })
      };

      console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });

      const user = new User(userData);
      await user.save();

      console.log('User created successfully:', user._id);

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            ...(user.role === 'student' && {
              studentId: user.studentId,
              department: user.department
            })
          }
        }
      });
    } catch (saveError) {
      console.error('Error saving user:', {
        error: saveError,
        stack: saveError.stack,
        validationErrors: saveError.errors
      });
      
      // Check for validation errors
      if (saveError.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.keys(saveError.errors).reduce((acc, key) => {
            acc[key] = saveError.errors[key].message;
            return acc;
          }, {})
        });
      }

      throw saveError; // Re-throw if not a validation error
    }
  } catch (error) {
    console.error('Registration error:', {
      error: error,
      stack: error.stack,
      message: error.message,
      code: error.code
    });

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    });
  }
};

// Login controller function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const logout = async (req, res) => {
    try {
        // Update last active timestamp
        await User.findByIdAndUpdate(req.user._id, {
            lastActive: new Date()
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

module.exports = {
    login,
    register,
    logout,
    getProfile,
    validateRegister,
    validateLogin
}; 