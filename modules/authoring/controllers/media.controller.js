const mediaService = require('../services/media.service');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { validate } = require('../../../shared/middlewares/validate');
const { createMediaSchema, updateMediaSchema } = require('../validations/media.validation');
const { ValidationError } = require('../../../shared/errors');

// Helper function to map MIME type to media type
const getMediaTypeFromMime = (mimeType) => {
  const mimeToType = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'video/mp4': 'video',
    'video/webm': 'video',
    'audio/mpeg': 'audio',
    'audio/wav': 'audio',
    'application/pdf': 'document'
  };
  
  return mimeToType[mimeType] || 'other';
};

// Upload new media
const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('No file uploaded');
  }

  // Construct media data from file and request body
  const mediaData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    type: getMediaTypeFromMime(req.file.mimetype),
    mimeType: req.file.mimetype,
    size: req.file.size,
    ...req.body
  };

  // Validate the constructed data
  const { error } = createMediaSchema.validate(mediaData);
  if (error) {
    throw new ValidationError(error.details.map(detail => detail.message).join(', '));
  }

  const media = await mediaService.uploadMedia(req.file, mediaData, req.user.id);
  res.status(201).json({
    status: 'success',
    data: { media }
  });
});

// Get media by ID
const getMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.getMediaById(req.params.id);
  res.json({
    status: 'success',
    data: { media }
  });
});

// Get media by type
const getMediaByType = asyncHandler(async (req, res) => {
  const media = await mediaService.getMediaByType(req.params.type);
  res.json({
    status: 'success',
    data: { media }
  });
});

// Update media
const updateMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.updateMedia(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { media }
  });
});

// Delete media
const deleteMedia = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id, req.user.id);
  res.json({
    status: 'success',
    message: 'Media deleted successfully'
  });
});

// Get media usage
const getMediaUsage = asyncHandler(async (req, res) => {
  const usage = await mediaService.getMediaUsage(req.params.id);
  res.json({
    status: 'success',
    data: { usage }
  });
});

module.exports = {
  uploadMedia,
  getMedia,
  getMediaByType,
  updateMedia: [validate(updateMediaSchema), updateMedia],
  deleteMedia,
  getMediaUsage
}; 