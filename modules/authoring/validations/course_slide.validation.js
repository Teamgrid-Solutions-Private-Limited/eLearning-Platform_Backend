const Joi = require('joi');

const createSlideSchema = Joi.object({
  module_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  type: Joi.string()
    .valid('video', 'html', 'quiz')
    .required(),
  content: Joi.alternatives().conditional('type', {
    is: 'video',
    then: Joi.object({
      videoUrl: Joi.string().uri().required(),
      duration: Joi.number().min(0),
      thumbnailUrl: Joi.string().uri(),
      captions: Joi.array().items(
        Joi.object({
          language: Joi.string().required(),
          url: Joi.string().uri().required()
        })
      )
    }),
    is: 'html',
    then: Joi.object({
      html: Joi.string().required(),
      css: Joi.string(),
      js: Joi.string(),
      assets: Joi.array().items(
        Joi.object({
          type: Joi.string().valid('image', 'audio', 'video', 'document').required(),
          url: Joi.string().uri().required(),
          alt: Joi.string()
        })
      )
    }),
    is: 'quiz',
    then: Joi.object({
      quizId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      timeLimit: Joi.number().min(0),
      passingScore: Joi.number().min(0).max(100),
      showResults: Joi.boolean().default(true),
      allowRetake: Joi.boolean().default(false),
      maxAttempts: Joi.number().min(1)
    })
  }).required(),
  order: Joi.number().min(0).required(),
  title: Joi.string().required().trim(),
  isActive: Joi.boolean().default(true)
});

const updateSlideSchema = createSlideSchema.fork(
  ['module_id', 'type'],
  (schema) => schema.optional()
);

const reorderSlidesSchema = Joi.object({
  slides: Joi.array().items(
    Joi.object({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      order: Joi.number().min(0).required()
    })
  ).min(1).required()
});

module.exports = {
  createSlideSchema,
  updateSlideSchema,
  reorderSlidesSchema
}; 