const Joi = require('joi');

const createMediaSchema = Joi.object({
  filename: Joi.string().required(),
  originalName: Joi.string().required(),
  url: Joi.string().uri().required(),
  type: Joi.string().required().valid('image', 'video', 'audio', 'document', 'other'),
  mimeType: Joi.string().required(),
  size: Joi.number().required(),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number()
  }),
  duration: Joi.number(),
  metadata: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(''),
    tags: Joi.array().items(Joi.string()),
    alt: Joi.string(),
    caption: Joi.string()
  }),
  uploadedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  course: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  isPublic: Joi.boolean().default(false),
  status: Joi.string().valid('processing', 'ready', 'error').default('processing'),
  error: Joi.object({
    message: Joi.string(),
    code: Joi.string()
  })
});

const updateMediaSchema = Joi.object({
  filename: Joi.string(),
  originalName: Joi.string(),
  url: Joi.string().uri(),
  type: Joi.string().valid('image', 'video', 'audio', 'document', 'other'),
  mimeType: Joi.string(),
  size: Joi.number(),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number()
  }),
  duration: Joi.number(),
  metadata: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(''),
    tags: Joi.array().items(Joi.string()),
    alt: Joi.string(),
    caption: Joi.string()
  }),
  uploadedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  course: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  isPublic: Joi.boolean(),
  status: Joi.string().valid('processing', 'ready', 'error'),
  error: Joi.object({
    message: Joi.string(),
    code: Joi.string()
  })
});

module.exports = {
  createMediaSchema,
  updateMediaSchema
}; 