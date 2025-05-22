const express = require('express');
const { auth } = require('../../../shared/middlewares/auth.middleware');
const { authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const { checkPermission } = require('../../../shared/middlewares/role.middleware');
const {
  createQuiz,
  getQuiz,
  getQuizzesByLesson,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  getQuizResults
} = require('../controllers/quiz.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get quiz by ID
router.get('/:id', getQuiz);

// Get quizzes by lesson
router.get('/lesson/:lessonId', getQuizzesByLesson);

// Get quiz results
router.get('/:id/results', getQuizResults);

// Create new quiz (instructor/admin only)
router.post('/',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  createQuiz
);

// Update quiz (instructor/admin only)
router.patch('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  updateQuiz
);

// Delete quiz (instructor/admin only)
router.delete('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  deleteQuiz
);

// Add question to quiz (instructor/admin only)
router.post('/:id/questions',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  addQuestion
);

// Update question (instructor/admin only)
router.patch('/:id/questions/:questionId',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  updateQuestion
);

// Delete question (instructor/admin only)
router.delete('/:id/questions/:questionId',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  deleteQuestion
);

// Reorder questions (instructor/admin only)
router.post('/:id/questions/reorder',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  reorderQuestions
);

module.exports = router; 