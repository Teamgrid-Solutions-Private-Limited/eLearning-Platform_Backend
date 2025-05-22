const quizService = require('../services/quiz.service');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { validate } = require('../../../shared/middlewares/validate');
const {
  createQuizSchema,
  updateQuizSchema,
  addQuestionSchema,
  updateQuestionSchema,
  reorderQuestionsSchema
} = require('../validations/quiz.validation');

// Create new quiz
const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    data: { quiz }
  });
});

// Get quiz by ID
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.id);
  res.json({
    status: 'success',
    data: { quiz }
  });
});

// Get quizzes by lesson
const getQuizzesByLesson = asyncHandler(async (req, res) => {
  const quizzes = await quizService.getQuizzesByLesson(req.params.lessonId);
  res.json({
    status: 'success',
    data: { quizzes }
  });
});

// Update quiz
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.updateQuiz(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { quiz }
  });
});

// Delete quiz
const deleteQuiz = asyncHandler(async (req, res) => {
  await quizService.deleteQuiz(req.params.id, req.user.id);
  res.json({
    status: 'success',
    message: 'Quiz deleted successfully'
  });
});

// Add question to quiz
const addQuestion = asyncHandler(async (req, res) => {
  const quiz = await quizService.addQuestion(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { quiz }
  });
});

// Update question
const updateQuestion = asyncHandler(async (req, res) => {
  const quiz = await quizService.updateQuestion(
    req.params.id,
    req.params.questionId,
    req.body,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { quiz }
  });
});

// Delete question
const deleteQuestion = asyncHandler(async (req, res) => {
  const quiz = await quizService.deleteQuestion(
    req.params.id,
    req.params.questionId,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { quiz }
  });
});

// Reorder questions
const reorderQuestions = asyncHandler(async (req, res) => {
  const quiz = await quizService.reorderQuestions(
    req.params.id,
    req.body.questionIds,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { quiz }
  });
});

// Get quiz results
const getQuizResults = asyncHandler(async (req, res) => {
  const results = await quizService.getQuizResults(
    req.params.id,
    req.user.id
  );
  res.json({
    status: 'success',
    data: { results }
  });
});

module.exports = {
  createQuiz: [validate(createQuizSchema), createQuiz],
  getQuiz,
  getQuizzesByLesson,
  updateQuiz: [validate(updateQuizSchema), updateQuiz],
  deleteQuiz,
  addQuestion: [validate(addQuestionSchema), addQuestion],
  updateQuestion: [validate(updateQuestionSchema), updateQuestion],
  deleteQuestion,
  reorderQuestions: [validate(reorderQuestionsSchema), reorderQuestions],
  getQuizResults
}; 