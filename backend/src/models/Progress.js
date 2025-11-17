const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    progressCount: { type: Number, required: true, default: 0 },
    expectedCount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['ahead', 'on-time', 'delayed'], default: 'on-time', index: true },
    deviation: { type: Number, default: 0 },
    imagePath: { type: String },
    metadata: { type: Object },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date }
  },
  { timestamps: true }
);

progressSchema.statics.calculateStatus = function (actual, expected) {
  // tolerance: within +/- 1% is on-time
  const diff = actual - expected;
  const tol = Math.max(1, Math.round(expected * 0.01));
  if (diff > tol) return 'ahead';
  if (diff < -tol) return 'delayed';
  return 'on-time';
};

module.exports = mongoose.model('Progress', progressSchema);

