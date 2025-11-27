const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    totalUnits: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ownerEmailNotifications: { type: Boolean, default: true },
    schedule: [
      {
        timestamp: { type: Date, required: true },
        expectedCount: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

projectSchema.methods.generateSchedule = function () {
  const schedule = [];
  const start = new Date(this.startDate).getTime();
  const end = new Date(this.endDate).getTime();
  const now = start;
  const durationMs = end - start;
  if (durationMs <= 0) return;
  // Generate daily schedule points (can be refined)
  const days = Math.ceil(durationMs / (24 * 60 * 60 * 1000));
  for (let d = 0; d <= days; d++) {
    const t = start + d * 24 * 60 * 60 * 1000;
    const ratio = Math.min(d / days, 1);
    schedule.push({
      timestamp: new Date(t),
      expectedCount: Math.round(this.totalUnits * ratio)
    });
  }
  this.schedule = schedule;
};

projectSchema.methods.getExpectedCount = function (atDate = new Date()) {
  if (!this.schedule || this.schedule.length === 0) {
    this.generateSchedule();
  }
  let expected = 0;
  for (const point of this.schedule) {
    if (point.timestamp <= atDate) {
      expected = point.expectedCount;
    } else {
      break;
    }
  }
  return expected;
};

module.exports = mongoose.model('Project', projectSchema);

