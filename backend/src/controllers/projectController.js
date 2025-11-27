const Project = require('../models/Project');

exports.updateProjectPreferences = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only owners can update project preferences
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Only owners can update project preferences' });
        }

        if (req.body.ownerEmailNotifications !== undefined) {
            project.ownerEmailNotifications = req.body.ownerEmailNotifications;
        }

        const updatedProject = await project.save();

        return res.json({
            _id: updatedProject._id,
            ownerEmailNotifications: updatedProject.ownerEmailNotifications
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
