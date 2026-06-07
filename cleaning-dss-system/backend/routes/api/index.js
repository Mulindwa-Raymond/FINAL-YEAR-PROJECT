/**
 * V1 Routes Index
 * Mounts all v1 endpoints with their respective base paths.
 */

const express = require('express');
const { inferenceRouter, historyRouter } = require('./v1/recommendationRoutes');
const equipmentRoutes = require('./v1/equipmentRoutes');
const equipmentSpecsRoutes = require('./v1/equipmentSpecsRoutes');
const detergentRoutes = require('./v1/detergentRoutes');
const compatibilityRoutes = require('./v1/compatibilityRoutes');
const ruleRoutes = require('./v1/ruleRoutes');
const feedbackRoutes = require('./v1/feedbackRoutes');
const tcoRoutes = require('./v1/tcoRoutes');
const authRoutes = require('./v1/authRoutes');
const adminRoutes = require('./v1/adminRoutes');
const metricRoutes = require('./v1/metricRoutes');
const trainingRoutes = require('./v1/trainingRoutes'); 

const router = express.Router();
const v1Router = express.Router();

// Core recommendation
v1Router.use('/recommend', inferenceRouter);
v1Router.use('/recommendations', historyRouter);

// Equipment management
v1Router.use('/equipment', equipmentRoutes);
v1Router.use('/equipment-specs', equipmentSpecsRoutes);

// Detergent management
v1Router.use('/detergents', detergentRoutes);

// Compatibility
v1Router.use('/compatibility', compatibilityRoutes);

// Knowledge base rules
v1Router.use('/rules', ruleRoutes);

// User feedback
v1Router.use('/feedback', feedbackRoutes);

// TCO (deprecated, kept for compatibility)
v1Router.use('/tco', tcoRoutes);

// Authentication
v1Router.use('/auth', authRoutes);

// Admin only routes (including training)
v1Router.use('/admin', adminRoutes);
v1Router.use('/admin/trainings', trainingRoutes); 

const publicTrainingRoutes = require('./v1/publicTrainingRoutes');
// ...
v1Router.use('/training/public', publicTrainingRoutes);
// Public metrics
v1Router.use('/metrics', metricRoutes);

// Mount v1 routes under /v1 prefix
router.use('/v1', v1Router);

module.exports = router;