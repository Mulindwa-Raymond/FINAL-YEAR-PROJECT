/**
 * Feedback Model
 * Stores user ratings and comments for specific recommendations.
 * Used for system evaluation and continuous improvement.
 */

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedback_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  recommendation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recommendation',
    required: [true, 'Recommendation ID is required'],
    unique: true  // One feedback per recommendation
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.feedback_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
feedbackSchema.index({ recommendation_id: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ created_at: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);