const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const userRoutes = require('./userRoutes');

router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

module.exports = router;
