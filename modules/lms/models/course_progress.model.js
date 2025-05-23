const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  scorm_cmi_data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  last_accessed: {
    type: Date,
    default: Date.now
  },
  completion_status: {
    type: String,
    enum: ['not_attempted', 'incomplete', 'completed', 'passed', 'failed'],
    default: 'not_attempted'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  time_spent: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
courseProgressSchema.index({ user_id: 1, course_id: 1 }, { unique: true });
courseProgressSchema.index({ completion_status: 1 });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

module.exports = CourseProgress; 