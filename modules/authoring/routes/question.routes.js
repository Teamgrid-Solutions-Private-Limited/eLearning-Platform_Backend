const express = require('express');
const { auth, authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const { checkPermission } = require('../../../shared/middlewares/role.middleware');
const { validate } = require('../../../shared/middlewares/validate');
const {
  createQuestionSchema,
  updateQuestionSchema,
  updateStatusSchema
} = require('../validations/question.validation');
const {
  createQuestion,
  getQuestion,
  getQuestionsByType,
  getQuestionsByDifficulty,
  updateQuestion,
  deleteQuestion,
  getQuestionsByTags,
  updateQuestionStatus
} = require('../controllers/question.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get question by ID
router.get('/:id', getQuestion);

// Get questions by type
router.get('/type/:type', getQuestionsByType);

// Get questions by difficulty
router.get('/difficulty/:difficulty', getQuestionsByDifficulty);

// Get questions by tags
router.get('/tags', getQuestionsByTags);

// Create new question (instructor/admin only)
router.post('/',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  validate(createQuestionSchema),
  createQuestion
);

// Update question (instructor/admin only)
router.patch('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  validate(updateQuestionSchema),
  updateQuestion
);

// Update question status (instructor/admin only)
router.patch('/:id/status',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  validate(updateStatusSchema),
  updateQuestionStatus
);

// Delete question (instructor/admin only)
router.delete('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_quizzes'),
  deleteQuestion
);

module.exports = router; 