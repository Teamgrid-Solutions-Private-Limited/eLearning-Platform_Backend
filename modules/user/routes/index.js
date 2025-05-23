const express = require('express');
const userRoutes = require('./user.routes');

const router = express.Router();

// Mount user routes
router.use('/', userRoutes);

module.exports = router; 