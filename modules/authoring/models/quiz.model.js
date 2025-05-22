const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
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
  lesson: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson',
    required: true
  },
  questions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question' 
  }],
  settings: {
    passingScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    timeLimit: {
      type: Number,
      min: 0
    },
    maxAttempts: {
      type: Number,
      min: 0,
      default: 3
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    showFeedback: {
      type: Boolean,
      default: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: false
    },
    requireAllQuestions: {
      type: Boolean,
      default: true
    },
    allowReview: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    tags: [String],
    objectives: [String],
    estimatedTime: Number
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

// Virtual for total points
quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + (question.points || 1), 0);
});

// Virtual for average score
quizSchema.virtual('averageScore').get(function() {
  if (!this.attempts || !this.attempts.length) return 0;
  const totalScore = this.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return totalScore / this.attempts.length;
});

// Virtual for pass rate
quizSchema.virtual('passRate').get(function() {
  if (!this.attempts || !this.attempts.length) return 0;
  const passedAttempts = this.attempts.filter(attempt => 
    attempt.score >= this.settings.passingScore
  );
  return (passedAttempts.length / this.attempts.length) * 100;
});

// Indexes
quizSchema.index({ lesson: 1 });
quizSchema.index({ 'metadata.tags': 1 });
quizSchema.index({ status: 1 });

// Pre-save middleware to validate quiz settings
quizSchema.pre('save', function(next) {
  if (this.settings.timeLimit && this.settings.timeLimit < 0) {
    next(new Error('Time limit cannot be negative'));
  }
  if (this.settings.maxAttempts && this.settings.maxAttempts < 0) {
    next(new Error('Max attempts cannot be negative'));
  }
  if (this.settings.passingScore && (this.settings.passingScore < 0 || this.settings.passingScore > 100)) {
    next(new Error('Passing score must be between 0 and 100'));
  }
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 