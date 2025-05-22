const Joi = require('joi');

const createModuleSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().allow(''),
  course: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  order: Joi.number().min(0).required(),
  duration: Joi.number().min(0),
  objectives: Joi.array().items(Joi.string()),
  prerequisites: Joi.array().items(Joi.string()),
  isRequired: Joi.boolean(),
  completionCriteria: Joi.string().valid('all_lessons', 'minimum_score', 'specific_lessons'),
  minimumScore: Joi.number().min(0).max(100),
  requiredLessons: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
});

const updateModuleSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow(''),
  order: Joi.number().min(0),
  duration: Joi.number().min(0),
  objectives: Joi.array().items(Joi.string()),
  prerequisites: Joi.array().items(Joi.string()),
  isRequired: Joi.boolean(),
  completionCriteria: Joi.string().valid('all_lessons', 'minimum_score', 'specific_lessons'),
  minimumScore: Joi.number().min(0).max(100),
  requiredLessons: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  isActive: Joi.boolean()
});

const reorderModulesSchema = Joi.object({
  moduleIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
});

module.exports = {
  createModuleSchema,
  updateModuleSchema,
  reorderModulesSchema
}; 