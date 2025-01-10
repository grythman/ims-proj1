const User = require('../models/User');
const Report = require('../models/Report');
const Evaluation = require('../models/Evaluation');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('internship');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get Student Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student profile'
    });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update Student Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student profile'
    });
  }
};

exports.updateStudentAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update Avatar Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating avatar'
    });
  }
};

exports.getStudentProgress = async (req, res) => {
  try {
    const progress = await User.findById(req.params.studentId)
      .select('progress evaluations reports')
      .populate('evaluations')
      .populate('reports');

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get Student Progress Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student progress'
    });
  }
};

exports.getStudentProgressDetails = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const progress = await User.findById(studentId)
            .select('progress evaluations submissions')
            .populate('evaluations')
            .populate('submissions');

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Get Student Progress Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student progress'
        });
    }
};

exports.addProgressNote = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const { note } = req.body;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        student.progress.push({
            note,
            addedBy: req.user._id,
            date: new Date()
        });

        await student.save();

        res.json({
            success: true,
            message: 'Progress note added successfully',
            data: student.progress
        });
    } catch (error) {
        console.error('Add Progress Note Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding progress note'
        });
    }
};

exports.getStudentSubmissions = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const submissions = await Report.find({ student: studentId })
            .sort('-createdAt');

        res.json({
            success: true,
            data: submissions
        });
    } catch (error) {
        console.error('Get Student Submissions Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student submissions'
        });
    }
};

exports.getStudentAllEvaluations = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const evaluations = await Evaluation.find({ student: studentId })
            .populate('evaluator', 'name role')
            .sort('-createdAt');

        res.json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        console.error('Get Student Evaluations Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student evaluations'
        });
    }
};

exports.getStudentsList = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('firstName lastName email studentId department')
            .sort('lastName');

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Get Students List Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students list'
        });
    }
}; 