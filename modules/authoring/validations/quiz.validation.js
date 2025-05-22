const Joi = require('joi');

const createQuizSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().allow(''),
  lesson: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  type: Joi.string().required().valid('practice', 'assessment', 'survey'),
  settings: Joi.object({
    timeLimit: Joi.number().min(0),
    passingScore: Joi.number().min(0).max(100),
    maxAttempts: Joi.number().min(1),
    shuffleQuestions: Joi.boolean(),
    showResults: Joi.boolean(),
    showCorrectAnswers: Joi.boolean(),
    allowReview: Joi.boolean(),
    requireCompletion: Joi.boolean()
  }),
  questions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  tags: Joi.array().items(Joi.string())
});

const updateQuizSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow(''),
  type: Joi.string().valid('practice', 'assessment', 'survey'),
  settings: Joi.object({
    timeLimit: Joi.number().min(0),
    passingScore: Joi.number().min(0).max(100),
    maxAttempts: Joi.number().min(1),
    shuffleQuestions: Joi.boolean(),
    showResults: Joi.boolean(),
    showCorrectAnswers: Joi.boolean(),
    allowReview: Joi.boolean(),
    requireCompletion: Joi.boolean()
  }),
  tags: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'published', 'archived')
});

const addQuestionSchema = Joi.object({
  type: Joi.string().required().valid('multiple_choice', 'true_false', 'short_answer', 'essay', 'matching'),
  text: Joi.string().required(),
  options: Joi.array().items(Joi.object({
    text: Joi.string().required(),
    isCorrect: Joi.boolean(),
    feedback: Joi.string()
  })),
  correctAnswer: Joi.string(),
  points: Joi.number().min(0).required(),
  feedback: Joi.string(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard'),
  tags: Joi.array().items(Joi.string())
});

const updateQuestionSchema = Joi.object({
  type: Joi.string().valid('multiple_choice', 'true_false', 'short_answer', 'essay', 'matching'),
  text: Joi.string(),
  options: Joi.array().items(Joi.object({
    text: Joi.string().required(),
    isCorrect: Joi.boolean(),
    feedback: Joi.string()
  })),
  correctAnswer: Joi.string(),
  points: Joi.number().min(0),
  feedback: Joi.string(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard'),
  tags: Joi.array().items(Joi.string())
});

const reorderQuestionsSchema = Joi.object({
  questionIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
});

module.exports = {
  createQuizSchema,
  updateQuizSchema,
  addQuestionSchema,
  updateQuestionSchema,
  reorderQuestionsSchema
}; 