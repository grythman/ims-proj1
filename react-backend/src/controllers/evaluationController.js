const Evaluation = require('../models/Evaluation');
const User = require('../models/User');

exports.getStudentEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ student: req.user.userId })
            .populate('evaluator', 'username role')
            .sort({ createdAt: -1 });
        res.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        res.status(500).json({ message: 'Error fetching evaluations' });
    }
};

exports.submitEvaluation = async (req, res) => {
    try {
        const { studentId, rating, comments, criteria } = req.body;
        const evaluation = new Evaluation({
            student: studentId,
            evaluator: req.user.userId,
            rating,
            comments,
            criteria
        });
        await evaluation.save();
        res.status(201).json({ message: 'Evaluation submitted successfully', evaluation });
    } catch (error) {
        console.error('Error submitting evaluation:', error);
        res.status(500).json({ message: 'Error submitting evaluation' });
    }
};

exports.getMentorEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ evaluator: req.user.userId })
            .populate('student', 'username email')
            .sort({ createdAt: -1 });
        res.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        res.status(500).json({ message: 'Error fetching evaluations' });
    }
};

exports.getEvaluationDetails = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id)
            .populate('student', 'username email')
            .populate('evaluator', 'username role');
        if (!evaluation) {
            return res.status(404).json({ message: 'Evaluation not found' });
        }
        res.json(evaluation);
    } catch (error) {
        console.error('Error fetching evaluation details:', error);
        res.status(500).json({ message: 'Error fetching evaluation details' });
    }
};

exports.getTeacherEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ 
            evaluator: req.user.userId,
            'evaluator.role': 'teacher'
        })
        .populate('student', 'username email')
        .sort({ createdAt: -1 });
        res.json(evaluations);
    } catch (error) {
        console.error('Error fetching teacher evaluations:', error);
        res.status(500).json({ message: 'Error fetching teacher evaluations' });
    }
};

exports.getTeacherEvaluationDetails = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id)
            .populate('student', 'username email')
            .populate('evaluator', 'username role');
        if (!evaluation) {
            return res.status(404).json({ message: 'Evaluation not found' });
        }
        if (evaluation.evaluator.role !== 'teacher') {
            return res.status(403).json({ message: 'Not a teacher evaluation' });
        }
        res.json(evaluation);
    } catch (error) {
        console.error('Error fetching teacher evaluation details:', error);
        res.status(500).json({ message: 'Error fetching teacher evaluation details' });
    }
};

exports.getMentorEvaluationDetails = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id)
            .populate('student', 'firstName lastName email')
            .populate('evaluator', 'firstName lastName role')
            .populate('reviewedBy', 'firstName lastName role');

        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: 'Evaluation not found'
            });
        }

        res.json({
            success: true,
            data: evaluation
        });
    } catch (error) {
        console.error('Get Mentor Evaluation Details Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching evaluation details'
        });
    }
};

exports.getMentorEvaluationsByTeacher = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({
            type: 'mentor',
            'reviewedBy.user': req.user._id
        })
        .populate('student', 'firstName lastName email')
        .populate('evaluator', 'firstName lastName role')
        .sort('-createdAt');

        res.json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        console.error('Get Mentor Evaluations By Teacher Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching mentor evaluations'
        });
    }
};

exports.getMentorEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({
            type: 'mentor',
            evaluator: req.user._id
        })
        .populate('student', 'firstName lastName email')
        .sort('-createdAt');

        res.json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        console.error('Get Mentor Evaluations Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching evaluations'
        });
    }
};

exports.updateMentorEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        .populate('student', 'firstName lastName email')
        .populate('evaluator', 'firstName lastName role');

        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: 'Evaluation not found'
            });
        }

        res.json({
            success: true,
            message: 'Evaluation updated successfully',
            data: evaluation
        });
    } catch (error) {
        console.error('Update Mentor Evaluation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating evaluation'
        });
    }
}; 