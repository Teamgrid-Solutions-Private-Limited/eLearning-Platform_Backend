const express = require('express');
const { auth } = require('../../../shared/middlewares/auth.middleware');
const { authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/user.controller');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(auth);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

module.exports = router; 