/**
 * recommendationHistoryService.js
 * Re-exports history functions from recommendationService for backward compatibility
 */

import {
  getRecommendationHistory,
  getRecommendationById,
  toggleSaveRecommendation,
  deleteRecommendation,
  saveRecommendationToHistory,
  getRecommendationStats,
  exportRecommendationPDF
} from './recommendationService';

export {
  getRecommendationHistory,
  getRecommendationById,
  toggleSaveRecommendation,
  deleteRecommendation,
  saveRecommendationToHistory,
  getRecommendationStats,
  exportRecommendationPDF
};