/**
 * FeedbackModal.jsx
 * 
 * Modal component for collecting user feedback on recommendations.
 * Features:
 * - Star rating widget (1-5 stars) with hover and click interaction
 * - Text area for optional comments (max 500 characters)
 * - Submit and skip buttons
 * - Confirmation message after submission
 * - Integration with feedback API
 */

import React, { useState } from 'react';
import { Star, X, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../services/feedbackService';

export const FeedbackModal = ({ isOpen, onClose, recommendationId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [skipConfirmed, setSkipConfirmed] = useState(false);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await submitFeedback({
        recommendation_id: recommendationId,
        rating,
        comment: comment.trim() || null,
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setRating(0);
        setComment('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setSkipConfirmed(true);
    setTimeout(() => {
      onClose();
      setSkipConfirmed(false);
      setRating(0);
      setComment('');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-600" />
            Share Your Feedback
          </h2>
          <button
            onClick={handleSkip}
            disabled={loading}
            className="p-1 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Thank You!</h3>
              <p className="text-slate-500 text-sm">Your feedback helps us improve our recommendations.</p>
            </div>
          ) : skipConfirmed ? (
            <div className="text-center py-6">
              <p className="text-slate-500 text-sm">You can provide feedback later from your history page.</p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 text-sm mb-6">
                How would you rate these recommendations? Your feedback helps us improve our matching algorithm.
              </p>

              {/* Star Rating Widget */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          (hoverRating >= star || rating >= star)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-slate-500">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  placeholder="Tell us what you liked or how we can improve..."
                  rows="4"
                  maxLength="500"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-slate-400">{comment.length}/500</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="flex-1 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;