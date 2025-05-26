const mongoose = require('mongoose');

const courseSlideSchema = new mongoose.Schema({
  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseModule',
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'html', 'quiz'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
courseSlideSchema.index({ module_id: 1, order: 1 });
courseSlideSchema.index({ type: 1 });

const CourseSlide = mongoose.model('CourseSlide', courseSlideSchema);

module.exports = CourseSlide; 