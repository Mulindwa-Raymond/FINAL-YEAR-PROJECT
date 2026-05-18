/**
 * V1 Routes Index
 * Mounts all v1 endpoints with their respective base paths.
 */

const express = require('express');
const recommendationRoutes = require('./recommendationRoutes');
const equipmentRoutes = require('./equipmentRoutes');
const detergentRoutes = require('./detergentRoutes');
const ruleRoutes = require('./ruleRoutes');
const tcoRoutes = require('./tcoRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const metricRoutes = require('./metricRoutes');

const router = express.Router();

// Public / user routes
router.use('/recommend', recommendationRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/detergents', detergentRoutes);
router.use('/rules', ruleRoutes);
router.use('/tco', tcoRoutes);
router.use('/auth', authRoutes);
router.use('/metrics', metricRoutes);

// Admin only routes (mounted separately, but auth & admin middleware are applied inside adminRoutes)
router.use('/admin', adminRoutes);

module.exports = router;