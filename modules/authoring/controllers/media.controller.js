const mediaService = require('../services/media.service');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { validate } = require('../../../shared/middlewares/validate');
const { createMediaSchema, updateMediaSchema } = require('../validations/media.validation');

// Upload new media
const uploadMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.uploadMedia(req.file, req.body, req.user.id);
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
  uploadMedia: [validate(createMediaSchema), uploadMedia],
  getMedia,
  getMediaByType,
  updateMedia: [validate(updateMediaSchema), updateMedia],
  deleteMedia,
  getMediaUsage
}; 