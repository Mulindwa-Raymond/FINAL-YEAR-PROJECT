/**
 * metricController.js
 * Provides aggregated metrics for regular users (e.g., their own usage).
 */

const SystemMetric = require('../models/SystemMetric');
const { success, error } = require('../utils/apiResponse');

/**
 * Get daily recommendation count for the current user (or global).
 * GET /api/v1/metrics/daily
 */
const getDailyMetrics = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const metric = await SystemMetric.findOne({ date: today });
    if (!metric) return success(res, { totalRecommendations: 0, message: 'No data for today' });
    return success(res, {
      date: metric.date,
      totalRecommendations: metric.totalRecommendations,
      averageResponseTimeMs: metric.averageResponseTimeMs
    }, 'Daily metrics');
  } catch (err) {
    next(err);
  }
};

/**
 * Get top categories and intensities over last 7 days.
 * GET /api/v1/metrics/trends
 */
const getTrends = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const metrics = await SystemMetric.find({ date: { $gte: sevenDaysAgo } }).sort({ date: 1 });
    // Aggregate top categories
    const categoryCount = {};
    metrics.forEach(m => {
      m.topCategories.forEach(c => {
        categoryCount[c.category] = (categoryCount[c.category] || 0) + c.count;
      });
    });
    const topCategories = Object.entries(categoryCount).map(([category, count]) => ({ category, count })).sort((a,b) => b.count - a.count).slice(0,5);
    return success(res, { topCategories, metrics }, 'Trends retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { getDailyMetrics, getTrends };