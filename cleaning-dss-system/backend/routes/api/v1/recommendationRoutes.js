/**
 * Recommendation Routes
 * Handles both KB-DSS inference engine and recommendation history management
 */

const express = require('express');
const { 
  getRecommendations,
  saveRecommendation,
  getRecommendationHistory,
  getRecommendationById,
  toggleSaveRecommendation,
  deleteRecommendation
} = require('../../../controllers/recommendationController');
const { auth } = require('../../../middleware/auth');
const { cacheMiddleware, cacheConfigs } = require('../../../middleware/cache');

// Create routers
const inferenceRouter = express.Router();
const historyRouter = express.Router();

// ==================== Inference Engine Routes ====================
// POST /api/v1/recommend - Get recommendations from inference engine
inferenceRouter.post('/', auth, getRecommendations);

// ==================== Recommendation History Routes ====================
// POST /api/v1/recommendations - Save a recommendation to user's history
historyRouter.post('/', auth, saveRecommendation);

// GET /api/v1/recommendations/history - Get user's recommendation history with pagination
historyRouter.get('/history', cacheMiddleware(cacheConfigs.userSpecific), auth, getRecommendationHistory);

// GET /api/v1/recommendations/:id - Get a single recommendation by ID
historyRouter.get('/:id', cacheMiddleware(cacheConfigs.userSpecific), auth, getRecommendationById);

// PATCH /api/v1/recommendations/:id/save - Toggle save status
historyRouter.patch('/:id/save', auth, toggleSaveRecommendation);

// DELETE /api/v1/recommendations/:id - Delete a recommendation
historyRouter.delete('/:id', auth, deleteRecommendation);

module.exports = {
  inferenceRouter,
  historyRouter
};