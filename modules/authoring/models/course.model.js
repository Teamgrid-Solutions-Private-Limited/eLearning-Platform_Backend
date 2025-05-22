const mongoose = require('mongoose');
const { SCORM_VERSIONS } = require('../../../shared/constants/scorm');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  scormVersion: {
    type: String,
    enum: Object.values(SCORM_VERSIONS),
    default: SCORM_VERSIONS.SCORM_1_2
  },
  contentPath: {
    type: String,
    required: true
  },
  metadata: {
    duration: Number,
    keywords: [String],
    language: String,
    prerequisites: String,
    objectives: [String],
    targetAudience: String
  },
  settings: {
    allowReview: {
      type: Boolean,
      default: true
    },
    masteryScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },
    maxAttempts: {
      type: Number,
      min: 0,
      default: 3
    },
    timeLimit: Number,
    navigation: {
      type: String,
      enum: ['linear', 'non-linear'],
      default: 'linear'
    }
  },
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
  return this.modules.reduce((total, module) => total + (module.duration || 0), 0);
});

// Indexes
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ author: 1, status: 1 });
courseSchema.index({ scormVersion: 1 });

// Pre-save middleware
courseSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published') {
    this.version += 1;
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 