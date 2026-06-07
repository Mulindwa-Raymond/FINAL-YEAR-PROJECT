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
 * - Modern UI matching system design
 */

import React, { useState, useEffect } from 'react';
import { Star, X, MessageSquare, CheckCircle, AlertCircle, Sparkles, ThumbsUp, ThumbsDown, Award } from 'lucide-react';
import { submitFeedback } from '../services/feedbackService';

export const FeedbackModal = ({ isOpen, onClose, recommendationId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [skipConfirmed, setSkipConfirmed] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [isOpen]);

  const handleRatingClick = (value) => {
    setRating(value);
    setError('');
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating before submitting');
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

  // Get rating label and icon
  const getRatingLabel = (rate) => {
    switch(rate) {
      case 1: return { text: 'Poor', icon: <ThumbsDown size={14} className="text-red-500" /> };
      case 2: return { text: 'Fair', icon: <ThumbsDown size={14} className="text-orange-500" /> };
      case 3: return { text: 'Good', icon: <ThumbsUp size={14} className="text-blue-500" /> };
      case 4: return { text: 'Very Good', icon: <ThumbsUp size={14} className="text-emerald-500" /> };
      case 5: return { text: 'Excellent', icon: <Award size={14} className="text-amber-500" /> };
      default: return { text: '', icon: null };
    }
  };

  const ratingLabel = getRatingLabel(rating);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 ${fadeIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Share Your Feedback</h2>
                <p className="text-white/80 text-[10px] font-mono mt-0.5">Help us improve your experience</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              disabled={loading}
              className="p-1.5 hover:bg-white/20 rounded-lg transition disabled:opacity-50"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Thank You!</h3>
              <p className="text-sm text-slate-500">Your feedback helps us improve our recommendations.</p>
              <div className="mt-4 flex items-center justify-center gap-1">
                <Sparkles size={12} className="text-amber-500" />
                <span className="text-[10px] text-slate-400">AI Learning Enhanced</span>
              </div>
            </div>
          ) : skipConfirmed ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
                <MessageSquare size={32} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">You can provide feedback later from your history page.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                How would you rate these recommendations? Your feedback helps us improve our matching algorithm and deliver better results.
              </p>

              {/* Star Rating Widget - Enhanced */}
              <div className="mb-6">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`
                          transition-all duration-200
                          ${(hoverRating >= star || rating >= star)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-200 hover:text-slate-300'
                          }
                        `}
                      />
                    </button>
                  ))}
                  
                  {/* Rating Label */}
                  {rating > 0 && ratingLabel.text && (
                    <div className="ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
                      {ratingLabel.icon}
                      <span className="text-xs font-semibold text-slate-700">{ratingLabel.text}</span>
                    </div>
                  )}
                </div>
                
                {/* Rating description */}
                <p className="text-[10px] text-slate-400 mt-2">
                  {rating === 0 && "Click a star to rate this recommendation"}
                  {rating === 1 && "Needs significant improvement"}
                  {rating === 2 && "Below expectations"}
                  {rating === 3 && "Meets expectations"}
                  {rating === 4 && "Exceeds expectations"}
                  {rating === 5 && "Perfect match!"}
                </p>
              </div>

              {/* Comment Textarea - Enhanced */}
              <div className="mb-6">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  placeholder="Tell us what you liked or how we can improve the recommendations..."
                  rows="4"
                  maxLength="500"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none text-sm placeholder:text-slate-400"
                />
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-[9px] text-slate-400">Optional</span>
                  <span className="text-[9px] font-mono text-slate-400">{comment.length}/500</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Buttons - Enhanced */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp size={14} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Footer note */}
              <p className="text-[9px] text-slate-400 text-center mt-4">
                Your feedback helps train our AI matching engine
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;