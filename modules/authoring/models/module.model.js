const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  lessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson' 
  }],
  order: { 
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    min: 0,
    default: 0
  },
  objectives: [String],
  prerequisites: [String],
  isRequired: {
    type: Boolean,
    default: true
  },
  completionCriteria: {
    type: String,
    enum: ['all_lessons', 'minimum_score', 'specific_lessons'],
    default: 'all_lessons'
  },
  minimumScore: {
    type: Number,
    min: 0,
    max: 100
  },
  requiredLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total lessons count
moduleSchema.virtual('totalLessons').get(function() {
  return this.lessons.length;
});

// Virtual for completion percentage
moduleSchema.virtual('completionPercentage').get(function() {
  if (!this.lessons.length) return 0;
  const completedLessons = this.lessons.filter(lesson => lesson.isCompleted);
  return (completedLessons.length / this.lessons.length) * 100;
});

// Indexes
moduleSchema.index({ course: 1, order: 1 });
moduleSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to update course duration
moduleSchema.pre('save', async function(next) {
  if (this.isModified('duration')) {
    const Course = mongoose.model('Course');
    await Course.findByIdAndUpdate(this.course, {
      $inc: { 'metadata.duration': this.duration - (this._oldDuration || 0) }
    });
    this._oldDuration = this.duration;
  }
  next();
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module; 