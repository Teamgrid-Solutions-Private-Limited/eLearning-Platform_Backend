const mongoose = require('mongoose');
const { SCORM_STATUS } = require('../../../shared/constants/scorm');

const trackingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(SCORM_STATUS),
    default: SCORM_STATUS.NOT_ATTEMPTED
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttempt: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  interactions: [{
    type: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    result: {
      type: String
    },
    score: {
      type: Number
    },
    timeSpent: {
      type: Number
    }
  }],
  location: {
    type: String
  },
  suspendData: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
trackingSchema.index({ user: 1, course: 1 }, { unique: true });
trackingSchema.index({ status: 1, lastAttempt: -1 });

const Tracking = mongoose.model('Tracking', trackingSchema);

module.exports = Tracking; 