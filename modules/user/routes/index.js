const express = require('express');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');

const router = express.Router();

// Mount user routes
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

module.exports = router; 