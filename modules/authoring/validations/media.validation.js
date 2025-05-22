const Joi = require('joi');

const createMediaSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().allow(''),
  type: Joi.string().required().valid('image', 'video', 'audio', 'document', 'other'),
  metadata: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    duration: Joi.number(),
    format: Joi.string(),
    size: Joi.number(),
    originalName: Joi.string(),
    mimeType: Joi.string()
  }),
  tags: Joi.array().items(Joi.string()),
  isPublic: Joi.boolean(),
  accessControl: Joi.object({
    roles: Joi.array().items(Joi.string()),
    users: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
  })
});

const updateMediaSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow(''),
  metadata: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    duration: Joi.number(),
    format: Joi.string(),
    size: Joi.number(),
    originalName: Joi.string(),
    mimeType: Joi.string()
  }),
  tags: Joi.array().items(Joi.string()),
  isPublic: Joi.boolean(),
  accessControl: Joi.object({
    roles: Joi.array().items(Joi.string()),
    users: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
  }),
  status: Joi.string().valid('active', 'archived', 'deleted')
});

module.exports = {
  createMediaSchema,
  updateMediaSchema
}; 