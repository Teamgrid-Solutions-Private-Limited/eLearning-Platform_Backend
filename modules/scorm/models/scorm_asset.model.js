const mongoose = require('mongoose');

const scormAssetSchema = new mongoose.Schema({
  scorm_package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScormPackage',
    required: true
  },
  file_path: {
    type: String,
    required: true
  },
  asset_type: {
    type: String,
    enum: ['js', 'html', 'video', 'image'],
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
scormAssetSchema.index({ scorm_package_id: 1 });
scormAssetSchema.index({ asset_type: 1 });

const ScormAsset = mongoose.model('ScormAsset', scormAssetSchema);

module.exports = ScormAsset; 