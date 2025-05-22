const lessonService = require('../services/lesson.service');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { validate } = require('../../../shared/middlewares/validate');
const {
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema
} = require('../validations/lesson.validation');

// Create new lesson
const createLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.createLesson(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    data: { lesson }
  });
});

// Get lesson by ID
const getLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.id);
  res.json({
    status: 'success',
    data: { lesson }
  });
});

// Get lessons by module
const getLessonsByModule = asyncHandler(async (req, res) => {
  const lessons = await lessonService.getLessonsByModule(req.params.moduleId);
  res.json({
    status: 'success',
    data: { lessons }
  });
});

// Update lesson
const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.updateLesson(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { lesson }
  });
});

// Delete lesson
const deleteLesson = asyncHandler(async (req, res) => {
  await lessonService.deleteLesson(req.params.id, req.user.id);
  res.json({
    status: 'success',
    message: 'Lesson deleted successfully'
  });
});

// Reorder lessons
const reorderLessons = asyncHandler(async (req, res) => {
  await lessonService.reorderLessons(
    req.params.moduleId,
    req.body.lessonIds,
    req.user.id
  );
  res.json({
    status: 'success',
    message: 'Lessons reordered successfully'
  });
});

// Get lesson progress
const getLessonProgress = asyncHandler(async (req, res) => {
  const progress = await lessonService.getLessonProgress(
    req.params.id,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { progress }
  });
});

// Update lesson progress
const updateLessonProgress = asyncHandler(async (req, res) => {
  const lesson = await lessonService.updateLessonProgress(
    req.params.id,
    req.user.id,
    req.body.progress
  );
  res.json({
    status: 'success',
    data: { lesson }
  });
});

module.exports = {
  createLesson: [validate(createLessonSchema), createLesson],
  getLesson,
  getLessonsByModule,
  updateLesson: [validate(updateLessonSchema), updateLesson],
  deleteLesson,
  reorderLessons: [validate(reorderLessonsSchema), reorderLessons],
  getLessonProgress,
  updateLessonProgress
}; 