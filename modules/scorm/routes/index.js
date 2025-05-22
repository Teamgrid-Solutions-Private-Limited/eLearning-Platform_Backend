const express = require('express');
const packageRoutes = require('./package.routes');
const trackingRoutes = require('./tracking.routes');

const router = express.Router();

// Mount all SCORM routes
router.use('/packages', packageRoutes);
router.use('/tracking', trackingRoutes);

module.exports = router; 