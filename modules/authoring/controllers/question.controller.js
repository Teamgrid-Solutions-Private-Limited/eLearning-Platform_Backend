const Question = require('../models/question.model');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { validate } = require('../../../shared/middlewares/validate');
const { ValidationError, NotFoundError, AuthorizationError } = require('../../../shared/errors');

// Create new question
const createQuestion = asyncHandler(async (req, res) => {
  const question = await Question.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { question }
  });
});

// Get question by ID
const getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  
  if (!question) {
    throw new NotFoundError('Question not found');
  }

  res.json({
    status: 'success',
    data: { question }
  });
});

// Get questions by type
const getQuestionsByType = asyncHandler(async (req, res) => {
  const questions = await Question.find({ type: req.params.type });
  
  res.json({
    status: 'success',
    data: { questions }
  });
});

// Get questions by difficulty
const getQuestionsByDifficulty = asyncHandler(async (req, res) => {
  const questions = await Question.find({ difficulty: req.params.difficulty });
  
  res.json({
    status: 'success',
    data: { questions }
  });
});

// Update question
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  
  if (!question) {
    throw new NotFoundError('Question not found');
  }

  // Check if user is authorized to update
  if (question.createdBy.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to update this question');
  }

  Object.assign(question, req.body);
  await question.save();

  res.json({
    status: 'success',
    data: { question }
  });
});

// Delete question
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  
  if (!question) {
    throw new NotFoundError('Question not found');
  }

  // Check if user is authorized to delete
  if (question.createdBy.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to delete this question');
  }

  await question.remove();

  res.json({
    status: 'success',
    message: 'Question deleted successfully'
  });
});

// Get questions by tags
const getQuestionsByTags = asyncHandler(async (req, res) => {
  const { tags } = req.query;
  const tagArray = tags.split(',');

  const questions = await Question.find({
    'metadata.tags': { $in: tagArray }
  });

  res.json({
    status: 'success',
    data: { questions }
  });
});

// Update question status
const updateQuestionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['draft', 'published', 'archived'].includes(status)) {
    throw new ValidationError('Invalid status value');
  }

  const question = await Question.findById(req.params.id);
  
  if (!question) {
    throw new NotFoundError('Question not found');
  }

  // Check if user is authorized to update
  if (question.createdBy.toString() !== req.user.id) {
    throw new AuthorizationError('Not authorized to update this question');
  }

  question.status = status;
  await question.save();

  res.json({
    status: 'success',
    data: { question }
  });
});

module.exports = {
  createQuestion,
  getQuestion,
  getQuestionsByType,
  getQuestionsByDifficulty,
  updateQuestion,
  deleteQuestion,
  getQuestionsByTags,
  updateQuestionStatus
}; 