const Role = require('../models/role.model');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { validate } = require('../../../shared/middlewares/validate');
const { createRoleSchema, updateRoleSchema } = require('../validations/role.validation');
const { NotFoundError } = require('../../../shared/errors');

// Create new role
const createRole = asyncHandler(async (req, res) => {
  const role = await Role.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { role }
  });
});

// Get all roles
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({ isActive: true });
  res.json({
    status: 'success',
    data: { roles }
  });
});

// Get role by ID
const getRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  res.json({
    status: 'success',
    data: { role }
  });
});

// Update role
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  res.json({
    status: 'success',
    data: { role }
  });
});

// Delete role
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  res.json({
    status: 'success',
    message: 'Role deleted successfully'
  });
});

module.exports = {
  createRole: [validate(createRoleSchema), createRole],
  getRoles,
  getRole,
  updateRole: [validate(updateRoleSchema), updateRole],
  deleteRole
}; 