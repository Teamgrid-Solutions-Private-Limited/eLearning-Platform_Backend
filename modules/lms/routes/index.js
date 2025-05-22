const express = require('express');
const enrollmentRoutes = require('./enrollment.routes');
const progressRoutes = require('./progress.routes');
const completionRoutes = require('./completion.routes');

const router = express.Router();

// Mount all LMS routes
router.use('/enrollments', enrollmentRoutes);
router.use('/progress', progressRoutes);
router.use('/completions', completionRoutes);

module.exports = router; 