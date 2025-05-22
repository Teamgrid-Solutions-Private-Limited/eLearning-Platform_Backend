const Joi = require('joi');

const createLessonSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().allow(''),
  module: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  type: Joi.string().required().valid('video', 'text', 'quiz', 'file', 'scorm', 'assignment'),
  content: Joi.object().required(),
  media: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  quiz: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  duration: Joi.number().min(0),
  order: Joi.number().min(0).required(),
  scormData: Joi.object({
    identifier: Joi.string(),
    launch: Joi.string(),
    masteryScore: Joi.number().min(0).max(100),
    timeLimit: Joi.number().min(0),
    prerequisites: Joi.array().items(Joi.string())
  }),
  settings: Joi.object({
    allowReview: Joi.boolean(),
    requireCompletion: Joi.boolean(),
    showProgress: Joi.boolean(),
    allowSkip: Joi.boolean()
  })
});

const updateLessonSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow(''),
  type: Joi.string().valid('video', 'text', 'quiz', 'file', 'scorm', 'assignment'),
  content: Joi.object(),
  media: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  quiz: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  duration: Joi.number().min(0),
  order: Joi.number().min(0),
  scormData: Joi.object({
    identifier: Joi.string(),
    launch: Joi.string(),
    masteryScore: Joi.number().min(0).max(100),
    timeLimit: Joi.number().min(0),
    prerequisites: Joi.array().items(Joi.string())
  }),
  settings: Joi.object({
    allowReview: Joi.boolean(),
    requireCompletion: Joi.boolean(),
    showProgress: Joi.boolean(),
    allowSkip: Joi.boolean()
  }),
  status: Joi.string().valid('draft', 'published', 'archived'),
  isActive: Joi.boolean()
});

const reorderLessonsSchema = Joi.object({
  lessonIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
});

module.exports = {
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema
}; 