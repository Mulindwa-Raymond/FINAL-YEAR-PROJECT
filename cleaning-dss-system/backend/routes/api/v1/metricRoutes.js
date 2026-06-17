/**
 * Metric Routes
 * GET /api/v1/metrics/daily - Daily recommendation counts
 * GET /api/v1/metrics/trends - Top categories & intensities (last 7 days)
 */

const express = require('express');
const { getDailyMetrics, getTrends } = require('../../../controllers/metricController');
const { auth } = require('../../../middleware/auth');
const { cacheMiddleware, cacheConfigs } = require('../../../middleware/cache');

const router = express.Router();

router.get('/daily', cacheMiddleware(cacheConfigs.recommendations), auth, getDailyMetrics);
router.get('/trends', cacheMiddleware(cacheConfigs.recommendations), auth, getTrends);

module.exports = router;