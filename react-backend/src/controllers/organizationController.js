const Organization = require('../models/Organization');
const User = require('../models/User');

exports.getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find()
            .sort({ name: 1 });
        res.json(organizations);
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({ message: 'Error fetching organizations' });
    }
};

exports.createOrganization = async (req, res) => {
    try {
        const { name, description, address, city, country, phone, email, website, industry, employeeCount } = req.body;
        
        const organization = new Organization({
            name,
            description,
            address,
            city,
            country,
            phone,
            email,
            website,
            industry,
            employeeCount,
            logo: req.file ? req.file.path : null
        });

        await organization.save();
        res.status(201).json({ message: 'Organization created successfully', organization });
    } catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).json({ message: 'Error creating organization' });
    }
};

exports.updateOrganization = async (req, res) => {
    try {
        const updates = req.body;
        if (req.file) {
            updates.logo = req.file.path;
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json({ message: 'Organization updated successfully', organization });
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({ message: 'Error updating organization' });
    }
};

exports.deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndDelete(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json({ message: 'Organization deleted successfully' });
    } catch (error) {
        console.error('Error deleting organization:', error);
        res.status(500).json({ message: 'Error deleting organization' });
    }
};

exports.getOrganizationDetails = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json(organization);
    } catch (error) {
        console.error('Error fetching organization details:', error);
        res.status(500).json({ message: 'Error fetching organization details' });
    }
};

exports.uploadOrganizationLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { logo: req.file.path },
            { new: true }
        );

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json({ message: 'Logo uploaded successfully', logoUrl: organization.logo });
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ message: 'Error uploading logo' });
    }
};

exports.getAvailableCompanies = async (req, res) => {
    try {
        const companies = await Organization.find({ 
            status: 'active',
            isAcceptingInterns: true 
        })
        .select('name industry city country')
        .sort({ name: 1 });
        
        res.json(companies);
    } catch (error) {
        console.error('Error fetching available companies:', error);
        res.status(500).json({ message: 'Error fetching available companies' });
    }
}; 