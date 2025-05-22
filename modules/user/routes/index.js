const express = require('express');
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const roleRoutes = require('./role.routes');

const router = express.Router();

// Mount all user routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/roles', roleRoutes);

module.exports = router; 