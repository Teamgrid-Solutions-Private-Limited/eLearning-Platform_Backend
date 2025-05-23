const mongoose = require('mongoose');

const scormPackageSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  zip_path: {
    type: String,
    required: true
  },
  manifest_path: {
    type: String,
    required: true
  },
  version: {
    type: String,
    enum: ['SCORM 1.2', 'SCORM 2004'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
scormPackageSchema.index({ course_id: 1 });
scormPackageSchema.index({ version: 1 });

const ScormPackage = mongoose.model('ScormPackage', scormPackageSchema);

module.exports = ScormPackage; 