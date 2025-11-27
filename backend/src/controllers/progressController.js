const Progress = require('../models/Progress');
const Project = require('../models/Project');

exports.getLatest = async (req, res) => {
  try {
    const { projectId } = req.params;
    const latest = await Progress.findOne({ project: projectId }).sort({ timestamp: -1 });
    if (!latest) return res.json(null);
    return res.json(latest);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50 } = req.query;
    const history = await Progress.find({ project: projectId }).sort({ timestamp: -1 }).limit(Number(limit));
    return res.json({ data: history });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate('customer');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const latest = await Progress.findOne({ project: projectId }).sort({ timestamp: -1 });
    const currentProgress = latest ? latest.progressCount : 0;

    // For real customer, use the per-cycle baseline; for others, use full schedule
    const realCustomerEmail = process.env.REAL_CUSTOMER_EMAIL || 'customer1@company.com';
    const baselineExpected = Number(process.env.REAL_EXPECTED_PER_CYCLE || 7);
    let expectedProgress;
    if (project.customer && project.customer.email === realCustomerEmail) {
      expectedProgress = baselineExpected;
    } else {
      expectedProgress = latest ? latest.expectedCount : project.getExpectedCount(new Date());
    }

    const completionPercentage = project.totalUnits ? Math.round((currentProgress / project.totalUnits) * 100) : 0;
    const averageDeviationAgg = await Progress.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: null, avgDev: { $avg: '$deviation' } } }
    ]);
    const averageDeviation = averageDeviationAgg.length ? averageDeviationAgg[0].avgDev : 0;
    return res.json({
      project,
      currentProgress,
      expectedProgress,
      completionPercentage,
      currentStatus: latest ? latest.status : 'unknown',
      averageDeviation
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('customer');
    const data = [];
    let onTrack = 0;
    let delayed = 0;
    let totalCompletion = 0;

    for (const proj of projects) {
      const latestProgress = await Progress.findOne({ project: proj._id }).sort({ timestamp: -1 });
      const current = latestProgress ? latestProgress.progressCount : 0;
      const expected = proj.getExpectedCount(new Date());
      const completion = proj.totalUnits ? Math.round((current / proj.totalUnits) * 100) : 0;
      const status = latestProgress ? latestProgress.status : 'unknown';

      if (status === 'delayed') delayed++;
      else onTrack++;
      totalCompletion += completion;

      data.push({
        projectId: proj._id,
        projectName: proj.name,
        customerName: proj.customer?.name || 'N/A',
        customerEmail: proj.customer?.email || 'N/A',
        totalUnits: proj.totalUnits,
        currentProgress: current,
        expectedProgress: expected,
        completionPercentage: completion,
        status,
        deviation: latestProgress ? latestProgress.deviation : 0,
        lastUpdate: latestProgress ? latestProgress.timestamp : null,
        ownerEmailNotifications: proj.ownerEmailNotifications !== false
      });
    }

    const summary = {
      totalProjects: projects.length,
      onTrack,
      delayed,
      averageCompletion: projects.length ? Math.round(totalCompletion / projects.length) : 0
    };
    return res.json({ summary, projects: data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { days = 7 } = req.query;
    const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);
    const entries = await Progress.find({ project: projectId, timestamp: { $gte: since } }).sort({ timestamp: 1 });
    const labels = entries.map(e => e.timestamp);
    const actual = entries.map(e => e.progressCount);
    const expected = entries.map(e => e.expectedCount);
    return res.json({ labels, actual, expected });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
