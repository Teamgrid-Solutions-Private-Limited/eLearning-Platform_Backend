const CourseSlide = require('../models/course_slide.model');
const CourseModule = require('../models/course_module.model');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { validate } = require('../../../shared/middlewares/validate');
const { ValidationError, NotFoundError, AuthorizationError } = require('../../../shared/errors');

// Create new slide
const createSlide = asyncHandler(async (req, res) => {
  // Check if module exists and user has access
  const module = await CourseModule.findById(req.body.module_id);
  if (!module) {
    throw new NotFoundError('Module not found');
  }

  if (module.author.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to add slides to this module');
  }

  // Get the highest order in the module
  const lastSlide = await CourseSlide.findOne({ module_id: req.body.module_id })
    .sort({ order: -1 });
  
  // Set the order to be after the last slide
  const order = lastSlide ? lastSlide.order + 1 : 0;
  
  const slide = await CourseSlide.create({
    ...req.body,
    order
  });

  res.status(201).json({
    status: 'success',
    data: { slide }
  });
});

// Get slide by ID
const getSlide = asyncHandler(async (req, res) => {
  const slide = await CourseSlide.findById(req.params.id);
  
  if (!slide) {
    throw new NotFoundError('Slide not found');
  }

  res.json({
    status: 'success',
    data: { slide }
  });
});

// Get slides by module
const getSlidesByModule = asyncHandler(async (req, res) => {
  const slides = await CourseSlide.find({ module_id: req.params.moduleId })
    .sort({ order: 1 });
  
  res.json({
    status: 'success',
    data: { slides }
  });
});

// Update slide
const updateSlide = asyncHandler(async (req, res) => {
  const slide = await CourseSlide.findById(req.params.id);
  
  if (!slide) {
    throw new NotFoundError('Slide not found');
  }

  // Check if user has access to the module
  const module = await CourseModule.findById(slide.module_id);
  if (module.author.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to update this slide');
  }

  Object.assign(slide, req.body);
  await slide.save();

  res.json({
    status: 'success',
    data: { slide }
  });
});

// Delete slide
const deleteSlide = asyncHandler(async (req, res) => {
  const slide = await CourseSlide.findById(req.params.id);
  
  if (!slide) {
    throw new NotFoundError('Slide not found');
  }

  // Check if user has access to the module
  const module = await CourseModule.findById(slide.module_id);
  if (module.author.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to delete this slide');
  }

  await slide.remove();

  // Reorder remaining slides
  await CourseSlide.updateMany(
    { module_id: slide.module_id, order: { $gt: slide.order } },
    { $inc: { order: -1 } }
  );

  res.json({
    status: 'success',
    message: 'Slide deleted successfully'
  });
});

// Reorder slides
const reorderSlides = asyncHandler(async (req, res) => {
  const { slides } = req.body;
  const moduleId = req.params.moduleId;

  // Check if user has access to the module
  const module = await CourseModule.findById(moduleId);
  if (!module) {
    throw new NotFoundError('Module not found');
  }

  if (module.author.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to reorder slides in this module');
  }

  // Update all slides in a single operation
  const bulkOps = slides.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: id, module_id: moduleId },
      update: { $set: { order } }
    }
  }));

  await CourseSlide.bulkWrite(bulkOps);

  res.json({
    status: 'success',
    message: 'Slides reordered successfully'
  });
});

// Toggle slide active status
const toggleSlideStatus = asyncHandler(async (req, res) => {
  const slide = await CourseSlide.findById(req.params.id);
  
  if (!slide) {
    throw new NotFoundError('Slide not found');
  }

  // Check if user has access to the module
  const module = await CourseModule.findById(slide.module_id);
  if (module.author.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to update this slide');
  }

  slide.isActive = !slide.isActive;
  await slide.save();

  res.json({
    status: 'success',
    data: { slide }
  });
});

module.exports = {
  createSlide,
  getSlide,
  getSlidesByModule,
  updateSlide,
  deleteSlide,
  reorderSlides,
  toggleSlideStatus
}; 