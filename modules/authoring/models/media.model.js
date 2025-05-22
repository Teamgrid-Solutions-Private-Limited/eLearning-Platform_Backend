const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String,
    required: true
  },
  url: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['image', 'video', 'audio', 'document', 'other'],
    required: true 
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  dimensions: {
    width: Number,
    height: Number
  },
  duration: Number, // For video/audio
  metadata: {
    title: String,
    description: String,
    tags: [String],
    alt: String,
    caption: String
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'error'],
    default: 'processing'
  },
  error: {
    message: String,
    code: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for file extension
mediaSchema.virtual('extension').get(function() {
  return this.originalName.split('.').pop().toLowerCase();
});

// Virtual for formatted size
mediaSchema.virtual('formattedSize').get(function() {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = this.size;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
});

// Indexes
mediaSchema.index({ uploadedBy: 1, type: 1 });
mediaSchema.index({ course: 1 });
mediaSchema.index({ 'metadata.tags': 1 });
mediaSchema.index({ status: 1 });

// Pre-save middleware to validate file type
mediaSchema.pre('save', function(next) {
  const allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  if (!allowedTypes[this.type]?.includes(this.mimeType)) {
    next(new Error(`Invalid mime type ${this.mimeType} for media type ${this.type}`));
  }
  next();
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media; 