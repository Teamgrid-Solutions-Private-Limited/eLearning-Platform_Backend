const express = require('express');
const authoringRoutes = require('../modules/authoring/routes');
const scormRoutes = require('../modules/scorm/routes');
const lmsRoutes = require('../modules/lms/routes');
const userRoutes = require('../modules/user/routes');
const publicRoutes = require('../modules/public/routes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Mount all module routes
router.use('/api/authoring', authoringRoutes);
router.use('/api/scorm', scormRoutes);
router.use('/api/lms', lmsRoutes);
router.use('/api/users', userRoutes);
router.use('/api/public', publicRoutes);

module.exports = router; 