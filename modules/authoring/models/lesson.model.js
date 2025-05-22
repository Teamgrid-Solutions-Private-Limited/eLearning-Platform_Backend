const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
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
  module: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['video', 'text', 'quiz', 'file', 'scorm', 'assignment'],
    required: true 
  },
  content: { 
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  media: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Media' 
  }],
  quiz: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz' 
  },
  duration: { 
    type: Number,
    min: 0,
    default: 0
  },
  order: { 
    type: Number,
    required: true,
    min: 0
  },
  scormData: {
    identifier: String,
    launch: String,
    masteryScore: Number,
    timeLimit: Number,
    prerequisites: [String]
  },
  settings: {
    allowReview: {
      type: Boolean,
      default: true
    },
    requireCompletion: {
      type: Boolean,
      default: true
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    allowSkip: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
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

// Virtual for completion status
lessonSchema.virtual('isCompleted').get(function() {
  if (this.type === 'quiz') {
    return this.quiz && this.quiz.isPassed;
  }
  return this.progress && this.progress.completed;
});

// Indexes
lessonSchema.index({ module: 1, order: 1 });
lessonSchema.index({ title: 'text', description: 'text' });
lessonSchema.index({ type: 1 });

// Pre-save middleware to update module duration
lessonSchema.pre('save', async function(next) {
  if (this.isModified('duration')) {
    const Module = mongoose.model('Module');
    await Module.findByIdAndUpdate(this.module, {
      $inc: { duration: this.duration - (this._oldDuration || 0) }
    });
    this._oldDuration = this.duration;
  }
  next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson; 