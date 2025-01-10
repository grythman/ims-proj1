const Internship = require('../models/Internship');
const User = require('../models/User');
const Organization = require('../models/Organization');

exports.registerInternship = async (req, res) => {
    try {
        const { company, position, startDate, endDate, supervisor, description } = req.body;
        
        // Check if student already has an active internship
        const existingInternship = await Internship.findOne({
            student: req.user.userId,
            status: 'active'
        });

        if (existingInternship) {
            return res.status(400).json({ message: 'You already have an active internship' });
        }

        const internship = new Internship({
            student: req.user.userId,
            company,
            position,
            startDate,
            endDate,
            supervisor,
            description
        });

        await internship.save();
        res.status(201).json({ message: 'Internship registered successfully', internship });
    } catch (error) {
        console.error('Error registering internship:', error);
        res.status(500).json({ message: 'Error registering internship' });
    }
};

exports.getInternshipDetails = async (req, res) => {
    try {
        const internship = await Internship.findOne({ 
            student: req.user.userId,
            status: 'active'
        })
        .populate('company', 'name address')
        .populate('supervisor', 'username email');

        if (!internship) {
            return res.status(404).json({ message: 'No active internship found' });
        }

        res.json(internship);
    } catch (error) {
        console.error('Error fetching internship details:', error);
        res.status(500).json({ message: 'Error fetching internship details' });
    }
};

exports.getInternshipDuration = async (req, res) => {
    try {
        const internship = await Internship.findOne({
            student: req.user.userId,
            status: 'active'
        });

        if (!internship) {
            return res.status(404).json({ message: 'No active internship found' });
        }

        const startDate = new Date(internship.startDate);
        const endDate = new Date(internship.endDate);
        const today = new Date();

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysCompleted = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
        const progressPercentage = Math.min(Math.round((daysCompleted / totalDays) * 100), 100);

        res.json({
            startDate: internship.startDate,
            endDate: internship.endDate,
            totalDays,
            daysCompleted,
            progressPercentage,
            remainingDays: Math.max(totalDays - daysCompleted, 0)
        });
    } catch (error) {
        console.error('Error fetching internship duration:', error);
        res.status(500).json({ message: 'Error fetching internship duration' });
    }
}; 