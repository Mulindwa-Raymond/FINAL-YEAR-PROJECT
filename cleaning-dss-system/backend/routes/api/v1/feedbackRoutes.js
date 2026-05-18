/**
 * Feedback Routes
 * POST /api/v1/feedback - Submit feedback for a recommendation (authenticated)
 * GET /api/v1/feedback/recommendation/:recommendationId - Get feedback for a recommendation
 */

const express = require('express');
const {
  submitFeedback,
  getFeedbackByRecommendation
} = require('../../../controllers/feedbackController');
const { auth } = require('../../../middleware/auth');

const router = express.Router();

router.post('/', auth, submitFeedback);
router.get('/recommendation/:recommendationId', auth, getFeedbackByRecommendation);

module.exports = router;