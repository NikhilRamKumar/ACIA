import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../services/api';

const getThreatColor = (threatScore) => {
  if (threatScore >= 7) return { bg: 'from-threat-high/10', border: 'border-threat-high/50', text: 'text-threat-high', glow: 'glow-red' };
  if (threatScore >= 4) return { bg: 'from-threat-medium/10', border: 'border-threat-medium/50', text: 'text-threat-medium', glow: 'glow-orange' };
  return { bg: 'from-threat-low/10', border: 'border-threat-low/50', text: 'text-threat-low', glow: 'glow-green' };
};

const getThreatLabel = (threatScore) => {
  if (threatScore >= 7) return 'HIGH THREAT';
  if (threatScore >= 4) return 'MEDIUM THREAT';
  return 'LOW THREAT';
};

const UpdateCard = ({ update, delay = 0 }) => {
  const threatColor = getThreatColor(update.threat_score || 0);

  const [feedbackType, setFeedbackType] = useState("Useful");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    setFeedbackMessage("");

    try {
      await submitFeedback({
        update_id: update.id,
        feedback_type: feedbackType,
        rating: Number(rating),
        comment: comment
      });

      setFeedbackMessage("Feedback submitted successfully.");
      setComment("");
      setRating(5);
      setFeedbackType("Useful");
    } catch (error) {
      console.error(error);
      setFeedbackMessage("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${threatColor.bg} to-dark-bg border ${threatColor.border} backdrop-blur-glass p-5 transition-all duration-300 hover:border-opacity-100 group`}
    >
      {/* Threat score indicator */}
      <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b ${threatColor.text === 'text-threat-high' ? 'from-threat-high to-threat-high/50' : threatColor.text === 'text-threat-medium' ? 'from-threat-medium to-threat-medium/50' : 'from-threat-low to-threat-low/50'}`} />

      {/* Content */}
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
              {update.title || 'Untitled Update'}
            </h3>
          </div>
          <div className={`flex-shrink-0 p-2 rounded-lg bg-${threatColor.text.split('-')[1]}/10 ${threatColor.text}`}>
            <AlertCircle size={16} />
          </div>
        </div>

        {/* Summary */}
        <p className="text-slate-400 text-sm line-clamp-2">
          {update.summary || update.description || 'No summary available'}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {update.category && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              update.category === 'Pricing Change'
                ? 'bg-gradient-to-r from-violet-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                : 'bg-neon-purple/10 text-neon-purple border border-neon-purple/30'
            }`}>
              {update.category === 'Pricing Change' ? '💰 Pricing Change Detected' : update.category}
            </span>
          )}
          {update.source_type && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/30">
              {update.source_type}
            </span>
          )}
        </div>

        {/* Threat score and source */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${threatColor.text} bg-white/5`}>
              {update.threat_score || 0}/10
            </span>
            <span className="text-xs text-slate-500">
              {getThreatLabel(update.threat_score || 0)}
            </span>
          </div>
          {update.source_link && (
            <a
              href={update.source_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:text-neon-blue transition-colors duration-300 p-1"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {/* Threat reason */}
        {update.threat_reason && (
          <p className="text-xs text-slate-500 italic border-l-2 border-neon-purple/50 pl-3">
            {update.threat_reason}
          </p>
        )}

        {/* Prediction section */}
        {update.prediction && (
          <div className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/10 p-4 space-y-2">
            <h4 className="text-sm font-semibold text-neon-cyan">Predicted Next Move</h4>
            <p className="text-xs text-slate-300">{update.prediction}</p>
            {update.confidence_level && (
              <p className="text-xs text-slate-400">Confidence: {update.confidence_level}</p>
            )}
          </div>
        )}

        {/* Recommended response section */}
        {update.recommended_response && (
          <div className="rounded-xl border border-neon-purple/20 bg-neon-purple/10 p-4 space-y-2">
            <h4 className="text-sm font-semibold text-neon-purple">Recommended Response</h4>
            <p className="text-xs text-slate-300">{update.recommended_response}</p>
          </div>
        )}

        {/* Feedback section */}
        <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-sm font-semibold text-blue-300">
            Feedback
          </p>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none"
            >
              <option value="Useful">Useful</option>
              <option value="Not Useful">Not Useful</option>
              <option value="Accurate">Accurate</option>
              <option value="Not Accurate">Not Accurate</option>
              <option value="Too Generic">Too Generic</option>
              <option value="Needs More Detail">Needs More Detail</option>
            </select>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Bad</option>
            </select>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write optional feedback..."
            className="mt-3 w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none min-h-[80px]"
          />

          <button
            onClick={handleSubmitFeedback}
            disabled={submitting}
            className="mt-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>

          {feedbackMessage && (
            <p className="text-xs text-slate-300 mt-3">
              {feedbackMessage}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateCard;
