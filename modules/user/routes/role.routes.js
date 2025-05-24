const express = require('express');
const { auth } = require('../../../shared/middlewares/auth.middleware');
const { authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const { checkPermission } = require('../../../shared/middlewares/role.middleware');
const {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole
} = require('../controllers/role.controller');

const router = express.Router();



// Apply authentication middleware to all routes
router.use(auth);

// Get all roles (admin only)
router.get('/',
  authorize(ROLES.ADMIN),
  checkPermission('manage_users'),
  getRoles
);

// Get role by ID (admin only)
router.get('/:id',
  authorize(ROLES.ADMIN),
  checkPermission('manage_users'),
  getRole
);

// Create new role (admin only)
router.post('/',
  authorize(ROLES.ADMIN),
  checkPermission('manage_users'),
  createRole
);

// Update role (admin only)
router.patch('/:id',
  authorize(ROLES.ADMIN),
  checkPermission('manage_users'),
  updateRole
);

// Delete role (admin only)
router.delete('/:id',
  authorize(ROLES.ADMIN),
  checkPermission('manage_users'),
  deleteRole
);

module.exports = router; 