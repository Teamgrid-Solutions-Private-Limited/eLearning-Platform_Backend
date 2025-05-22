const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['mcq', 'true-false', 'matching', 'fill-blank', 'short-answer', 'essay'],
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    min: 0,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    feedback: String,
    order: Number
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: function() {
      return ['true-false', 'fill-blank', 'short-answer', 'essay'].includes(this.type);
    }
  },
  matchingPairs: [{
    left: {
      type: String,
      required: true
    },
    right: {
      type: String,
      required: true
    }
  }],
  feedback: {
    correct: String,
    incorrect: String,
    partial: String
  },
  metadata: {
    tags: [String],
    objectives: [String],
    timeEstimate: Number
  },
  settings: {
    shuffleOptions: {
      type: Boolean,
      default: true
    },
    allowPartialCredit: {
      type: Boolean,
      default: false
    },
    caseSensitive: {
      type: Boolean,
      default: false
    },
    requireExactMatch: {
      type: Boolean,
      default: true
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

// Virtual for number of options
questionSchema.virtual('optionCount').get(function() {
  return this.options.length;
});

// Virtual for correct options count
questionSchema.virtual('correctOptionsCount').get(function() {
  return this.options.filter(option => option.isCorrect).length;
});

// Indexes
questionSchema.index({ type: 1 });
questionSchema.index({ 'metadata.tags': 1 });
questionSchema.index({ status: 1 });

// Pre-save middleware to validate question data
questionSchema.pre('save', function(next) {
  // Validate MCQ questions
  if (this.type === 'mcq') {
    if (!this.options || this.options.length < 2) {
      next(new Error('MCQ questions must have at least 2 options'));
    }
    const correctOptions = this.options.filter(opt => opt.isCorrect);
    if (correctOptions.length === 0) {
      next(new Error('MCQ questions must have at least one correct option'));
    }
  }

  // Validate matching questions
  if (this.type === 'matching') {
    if (!this.matchingPairs || this.matchingPairs.length < 2) {
      next(new Error('Matching questions must have at least 2 pairs'));
    }
  }

  // Validate true-false questions
  if (this.type === 'true-false') {
    if (typeof this.correctAnswer !== 'boolean') {
      next(new Error('True-false questions must have a boolean correct answer'));
    }
  }

  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question; 