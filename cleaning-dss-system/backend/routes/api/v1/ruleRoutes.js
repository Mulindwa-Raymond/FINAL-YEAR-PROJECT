/**
 * Rule Routes
 * GET /api/v1/rules - List rules (with filters)
 * GET /api/v1/rules/category/:category - Get rules by category
 * GET /api/v1/rules/:id - Get single rule
 * POST /api/v1/rules/match - Match rules against facts (testing)
 * POST /api/v1/rules - Create new rule (admin)
 * PUT /api/v1/rules/:id - Update rule (admin)
 * DELETE /api/v1/rules/:id - Soft delete rule (admin)
 * PATCH /api/v1/rules/:id/toggle - Toggle rule active status (admin)
 */

const express = require('express');
const {
  getAllRules,
  getRuleById,
  getRulesByCategory,
  matchRules,
  createRule,
  updateRule,
  deleteRule,
  toggleRule
} = require('../../../controllers/ruleController');
const { auth, requireAdmin } = require('../../../middleware/auth');
const { cacheMiddleware, cacheConfigs } = require('../../../middleware/cache');

const router = express.Router();

// Public read routes (authenticated users can view rules - with caching)
router.get('/', cacheMiddleware(cacheConfigs.lists), auth, getAllRules);
router.get('/category/:category', cacheMiddleware(cacheConfigs.lists), auth, getRulesByCategory);
router.get('/:id', cacheMiddleware(cacheConfigs.lists), auth, getRuleById);
router.post('/match', auth, matchRules);

// Admin write routes
router.post('/', auth, requireAdmin, createRule);
router.put('/:id', auth, requireAdmin, updateRule);
router.delete('/:id', auth, requireAdmin, deleteRule);
router.patch('/:id/toggle', auth, requireAdmin, toggleRule);

module.exports = router;