const Joi = require('joi');
const { SCORM_VERSIONS } = require('../../../shared/constants/scorm');

const createCourseSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10),
  scormVersion: Joi.string().valid(...Object.values(SCORM_VERSIONS)).required(),
  metadata: Joi.object({
    duration: Joi.number().min(0),
    keywords: Joi.array().items(Joi.string()),
    language: Joi.string(),
    prerequisites: Joi.string()
  }),
  settings: Joi.object({
    allowReview: Joi.boolean(),
    masteryScore: Joi.number().min(0).max(100),
    maxAttempts: Joi.number().min(0)
  })
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  metadata: Joi.object({
    duration: Joi.number().min(0),
    keywords: Joi.array().items(Joi.string()),
    language: Joi.string(),
    prerequisites: Joi.string()
  }),
  settings: Joi.object({
    allowReview: Joi.boolean(),
    masteryScore: Joi.number().min(0).max(100),
    maxAttempts: Joi.number().min(0)
  })
});

module.exports = {
  createCourseSchema,
  updateCourseSchema
}; 