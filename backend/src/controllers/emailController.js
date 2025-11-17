const emailService = require('../utils/emailService');
const Progress = require('../models/Progress');
const Project = require('../models/Project');
const User = require('../models/User');

exports.sendTest = async (req, res) => {
  try {
    const { email } = req.body;
    await emailService.sendEmail({
      to: email,
      subject: 'Test Email - Progress Monitoring System',
      html: '<p>This is a test email from the Automated Progress Monitoring System.</p>'
    });
    return res.json({ message: 'Test email sent' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.sendSummary = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId).populate('customer');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const latest = await Progress.findOne({ project: projectId }).sort({ timestamp: -1 });
    if (!latest) return res.status(404).json({ message: 'No progress to email' });
    await emailService.sendProgressEmail(project, latest);
    return res.json({ message: 'Summary email sent' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getEmailHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sent = await Progress.find({ project: projectId, emailSent: true }).sort({ emailSentAt: -1 }).limit(50);
    return res.json({ data: sent });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

