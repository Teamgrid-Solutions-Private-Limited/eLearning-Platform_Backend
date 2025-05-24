const express = require('express');
const { auth } = require('../../../shared/middlewares/auth.middleware');
const { authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const { checkPermission } = require('../../../shared/middlewares/role.middleware');
const {
  createModule,
  getModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
  reorderModules,
  getModuleProgress
} = require('../controllers/module.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get module by ID
router.get('/:id', getModule);

// Get modules by course
router.get('/course/:courseId', getModulesByCourse);

// Get module progress
router.get('/:id/progress', getModuleProgress);

// Create new module (instructor/admin only)
router.post('/',
  authorize(ROLES.AUTHOR, ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  createModule
);

// Update module (instructor/admin only)
router.patch('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  updateModule
);

// Delete module (instructor/admin only)
router.delete('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  deleteModule
);

// Reorder modules (instructor/admin only)
router.post('/course/:courseId/reorder',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_modules'),
  reorderModules
);

module.exports = router; 