const express = require('express');
const { auth } = require('../../../shared/middlewares/auth.middleware');
const { authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const { checkPermission } = require('../../../shared/middlewares/role.middleware');
const {
  createLesson,
  getLesson,
  getLessonsByModule,
  updateLesson,
  deleteLesson,
  reorderLessons,
  getLessonProgress,
  updateLessonProgress
} = require('../controllers/lesson.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get lesson by ID
router.get('/:id', getLesson);

// Get lessons by module
router.get('/module/:moduleId', getLessonsByModule);

// Get lesson progress
router.get('/:id/progress', getLessonProgress);

// Update lesson progress
router.patch('/:id/progress', updateLessonProgress);

// Create new lesson (instructor/admin only)
router.post('/',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_lessons'),
  createLesson
);

// Update lesson (instructor/admin only)
router.patch('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_lessons'),
  updateLesson
);

// Delete lesson (instructor/admin only)
router.delete('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_lessons'),
  deleteLesson
);

// Reorder lessons (instructor/admin only)
router.post('/module/:moduleId/reorder',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_lessons'),
  reorderLessons
);

module.exports = router; 