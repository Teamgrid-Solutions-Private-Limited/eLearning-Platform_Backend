const moduleService = require('../services/module.service');
const asyncHandler = require('@shared/middlewares/asyncHandler');
const { validate } = require('@shared/middlewares/validate');
const {
  createModuleSchema,
  updateModuleSchema,
  reorderModulesSchema
} = require('../validations/module.validation');

// Create new module
const createModule = asyncHandler(async (req, res) => {
  const module = await moduleService.createModule(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    data: { module }
  });
});

// Get module by ID
const getModule = asyncHandler(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.id);
  res.json({
    status: 'success',
    data: { module }
  });
});

// Get modules by course
const getModulesByCourse = asyncHandler(async (req, res) => {
  const modules = await moduleService.getModulesByCourse(req.params.courseId);
  res.json({
    status: 'success',
    data: { modules }
  });
});

// Update module
const updateModule = asyncHandler(async (req, res) => {
  const module = await moduleService.updateModule(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { module }
  });
});

// Delete module
const deleteModule = asyncHandler(async (req, res) => {
  await moduleService.deleteModule(req.params.id, req.user.id);
  res.json({
    status: 'success',
    message: 'Module deleted successfully'
  });
});

// Reorder modules
const reorderModules = asyncHandler(async (req, res) => {
  await moduleService.reorderModules(
    req.params.courseId,
    req.body.moduleIds,
    req.user.id
  );
  res.json({
    status: 'success',
    message: 'Modules reordered successfully'
  });
});

// Get module progress
const getModuleProgress = asyncHandler(async (req, res) => {
  const progress = await moduleService.getModuleProgress(
    req.params.id,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { progress }
  });
});

module.exports = {
  createModule: [validate(createModuleSchema), createModule],
  getModule,
  getModulesByCourse,
  updateModule: [validate(updateModuleSchema), updateModule],
  deleteModule,
  reorderModules: [validate(reorderModulesSchema), reorderModules],
  getModuleProgress
}; 