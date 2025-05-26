const Joi = require('joi');

const createQuestionSchema = Joi.object({
  type: Joi.string()
    .valid('mcq', 'true-false', 'matching', 'fill-blank', 'short-answer', 'essay')
    .required(),
  text: Joi.string().required().trim(),
  description: Joi.string().trim(),
  points: Joi.number().min(0).default(1),
  difficulty: Joi.string()
    .valid('easy', 'medium', 'hard')
    .default('medium'),
  options: Joi.array().items(
    Joi.object({
      text: Joi.string().required().trim(),
      isCorrect: Joi.boolean().default(false),
      feedback: Joi.string(),
      order: Joi.number()
    })
  ),
  correctAnswer: Joi.alternatives().conditional('type', {
    is: Joi.string().valid('true-false', 'fill-blank', 'short-answer', 'essay'),
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  matchingPairs: Joi.array().items(
    Joi.object({
      left: Joi.string().required(),
      right: Joi.string().required()
    })
  ).when('type', {
    is: 'matching',
    then: Joi.required().min(2),
    otherwise: Joi.forbidden()
  }),
  feedback: Joi.object({
    correct: Joi.string(),
    incorrect: Joi.string(),
    partial: Joi.string()
  }),
  metadata: Joi.object({
    tags: Joi.array().items(Joi.string()),
    objectives: Joi.array().items(Joi.string()),
    timeEstimate: Joi.number()
  }),
  settings: Joi.object({
    shuffleOptions: Joi.boolean().default(true),
    allowPartialCredit: Joi.boolean().default(false),
    caseSensitive: Joi.boolean().default(false),
    requireExactMatch: Joi.boolean().default(true)
  }),
  status: Joi.string()
    .valid('draft', 'published', 'archived')
    .default('draft')
});

const updateQuestionSchema = createQuestionSchema.fork(
  ['type', 'text'],
  (schema) => schema.optional()
);

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('draft', 'published', 'archived')
    .required()
});

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
  updateStatusSchema
}; 