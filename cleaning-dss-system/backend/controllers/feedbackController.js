/**
 * feedbackController.js
 * Handles user feedback on recommendations.
 */

const Feedback = require('../models/Feedback');
const Recommendation = require('../models/Recommendation');
const { success, error } = require('../utils/apiResponse');

/**
 * Submit feedback for a recommendation
 * POST /api/v1/feedback
 * Body: { recommendation_id, rating, comment }
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { recommendation_id, rating, comment } = req.body;
    const user_id = req.user.id;
    
    if (!recommendation_id) {
      return error(res, 'Recommendation ID is required', 400);
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return error(res, 'Rating must be between 1 and 5', 400);
    }
    
    // Check if recommendation exists
    const recommendation = await Recommendation.findById(recommendation_id);
    if (!recommendation) {
      return error(res, 'Recommendation not found', 404);
    }
    
    // Check if user owns this recommendation
    if (recommendation.user_id.toString() !== user_id) {
      return error(res, 'You can only provide feedback for your own recommendations', 403);
    }
    
    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ recommendation_id });
    if (existingFeedback) {
      return error(res, 'Feedback already submitted for this recommendation', 409);
    }
    
    const feedback = new Feedback({
      recommendation_id,
      rating,
      comment: comment || null
    });
    
    await feedback.save();
    
    return success(res, {
      feedback_id: feedback._id,
      rating: feedback.rating,
      message: 'Thank you for your feedback!'
    }, 'Feedback submitted successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Get feedback for a specific recommendation (user can see their own)
 * GET /api/v1/feedback/recommendation/:recommendationId
 */
const getFeedbackByRecommendation = async (req, res, next) => {
  try {
    const { recommendationId } = req.params;
    const user_id = req.user.id;
    
    const recommendation = await Recommendation.findById(recommendationId);
    if (!recommendation) {
      return error(res, 'Recommendation not found', 404);
    }
    
    // Check if user owns this recommendation or is admin
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (recommendation.user_id.toString() !== user_id && !isAdmin) {
      return error(res, 'Access denied', 403);
    }
    
    const feedback = await Feedback.findOne({ recommendation_id: recommendationId });
    return success(res, feedback || null, 'Feedback retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get all feedback (admin only)
 * GET /api/v1/admin/feedback
 */
const getAllFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, rating, startDate, endDate } = req.query;
    const filter = {};
    
    if (rating) filter.rating = parseInt(rating);
    if (startDate || endDate) {
      filter.created_at = {};
      if (startDate) filter.created_at.$gte = new Date(startDate);
      if (endDate) filter.created_at.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const feedback = await Feedback.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'recommendation_id',
        select: 'user_id surface_type dirt_type machine_category',
        populate: { path: 'user_id', select: 'email username' }
      });
    
    const total = await Feedback.countDocuments(filter);
    
    return success(res, { feedback, total, page: parseInt(page), limit: parseInt(limit) }, 'Feedback retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get feedback statistics (admin only)
 * GET /api/v1/admin/feedback/stats
 */
const getFeedbackStats = async (req, res, next) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const total = await Feedback.countDocuments();
    const averageRating = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: '$rating' }
        }
      }
    ]);
    
    // Get recent feedback count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await Feedback.countDocuments({
      created_at: { $gte: sevenDaysAgo }
    });
    
    return success(res, {
      distribution: stats,
      total,
      averageRating: averageRating[0]?.avg || 0,
      recentCount
    }, 'Feedback statistics retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitFeedback,
  getFeedbackByRecommendation,
  getAllFeedback,
  getFeedbackStats
};