/**
 * Recommendation Routes
 * POST /api/v1/recommend - Get cleaning machine + detergent recommendations using KB-DSS inference engine
 */

const express = require('express');
const { getRecommendations } = require('../../../controllers/recommendationController');
const { auth } = require('../../../middleware/auth');
const { validateRecommendationRequest } = require('../../../middleware/validation');

const router = express.Router();

router.post('/',
  auth,
  validateRecommendationRequest,
  getRecommendations
);

module.exports = router;
