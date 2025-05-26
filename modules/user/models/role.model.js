const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: ['Admin', 'Author', 'Learner']
  },
  permissions: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
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
roleSchema.index({ name: 1 });

const Role = mongoose.model('Role', roleSchema);

module.exports = Role; 