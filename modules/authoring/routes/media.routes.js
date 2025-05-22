const express = require('express');
const { auth, authorize } = require('@shared/middlewares/auth.middleware');
const { ROLES } = require('@shared/constants/roles');
const { checkPermission } = require('@shared/middlewares/role.middleware');
const upload = require('@shared/middlewares/upload.middleware');
const {
  uploadMedia,
  getMedia,
  getMediaByType,
  updateMedia,
  deleteMedia,
  getMediaUsage
} = require('../controllers/media.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get media by ID
router.get('/:id', getMedia);

// Get media by type
router.get('/type/:type', getMediaByType);

// Get media usage
router.get('/:id/usage', getMediaUsage);

// Upload new media (instructor/admin only)
router.post('/',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_media'),
  upload.single('file'),
  uploadMedia
);

// Update media (instructor/admin only)
router.patch('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_media'),
  updateMedia
);

// Delete media (instructor/admin only)
router.delete('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_media'),
  deleteMedia
);

module.exports = router; 