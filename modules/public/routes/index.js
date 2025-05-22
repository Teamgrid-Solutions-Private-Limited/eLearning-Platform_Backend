const express = require('express');
const contentRoutes = require('./content.routes');
const categoryRoutes = require('./category.routes');

const router = express.Router();

// Mount all public routes
router.use('/content', contentRoutes);
router.use('/categories', categoryRoutes);

module.exports = router; 