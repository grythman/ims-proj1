const Report = require('../models/Report');
const User = require('../models/User');

exports.submitReport = async (req, res) => {
    try {
        const { title, description } = req.body;
        const report = new Report({
            title,
            description,
            student: req.user.userId,
            file: req.file ? req.file.path : null
        });
        await report.save();
        res.status(201).json({ message: 'Report submitted successfully', report });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Error submitting report' });
    }
};

exports.getStudentReports = async (req, res) => {
    try {
        const reports = await Report.find({ student: req.user.userId })
            .populate('student', 'username email')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports' });
    }
};

exports.getReportFeedback = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('feedback.author', 'username role');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report.feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Error fetching feedback' });
    }
};

exports.submitPreliminaryReport = async (req, res) => {
    try {
        const { title, description } = req.body;
        const report = new Report({
            title,
            description,
            student: req.user.userId,
            type: 'preliminary',
            file: req.file ? req.file.path : null
        });
        await report.save();
        res.status(201).json({ message: 'Preliminary report submitted successfully', report });
    } catch (error) {
        console.error('Error submitting preliminary report:', error);
        res.status(500).json({ message: 'Error submitting preliminary report' });
    }
};

exports.getPreliminaryReportStatus = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .select('status feedback');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json({ status: report.status, feedback: report.feedback });
    } catch (error) {
        console.error('Error fetching report status:', error);
        res.status(500).json({ message: 'Error fetching report status' });
    }
};

exports.getPreliminaryReportFeedback = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('feedback.author', 'username role');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report.feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Error fetching feedback' });
    }
};

exports.updatePreliminaryReport = async (req, res) => {
    try {
        const { title, description } = req.body;
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.student.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        report.title = title || report.title;
        report.description = description || report.description;
        if (req.file) {
            report.file = req.file.path;
        }

        await report.save();
        res.json({ message: 'Report updated successfully', report });
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Error updating report' });
    }
}; 