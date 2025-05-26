const express = require('express');
const { auth, authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const { checkPermission } = require('../../../shared/middlewares/role.middleware');
const { validate } = require('../../../shared/middlewares/validate');
const {
  createSlideSchema,
  updateSlideSchema,
  reorderSlidesSchema
} = require('../validations/course_slide.validation');
const {
  createSlide,
  getSlide,
  getSlidesByModule,
  updateSlide,
  deleteSlide,
  reorderSlides,
  toggleSlideStatus
} = require('../controllers/course_slide.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get slide by ID
router.get('/:id', getSlide);

// Get slides by module
router.get('/module/:moduleId', getSlidesByModule);

// Create new slide (instructor/admin only)
router.post('/',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  validate(createSlideSchema),
  createSlide
);

// Update slide (instructor/admin only)
router.patch('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  validate(updateSlideSchema),
  updateSlide
);

// Delete slide (instructor/admin only)
router.delete('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  deleteSlide
);

// Reorder slides (instructor/admin only)
router.patch('/module/:moduleId/reorder',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  validate(reorderSlidesSchema),
  reorderSlides
);

// Toggle slide status (instructor/admin only)
router.patch('/:id/toggle-status',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  toggleSlideStatus
);

module.exports = router; 