import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, AlertCircle, Zap, TrendingUp, Lightbulb } from 'lucide-react';
import { submitFeedback } from '../services/api';
import UpdateDetailsModal from './UpdateDetailsModal';

const getThreatColor = (threatScore, threatLevel) => {
  // Use threat_level from backend if available, otherwise fall back to score
  const level = threatLevel?.toLowerCase() || (threatScore >= 7 ? 'high' : threatScore >= 4 ? 'medium' : 'low');
  
  if (level === 'high') return { 
    bg: 'from-threat-high/10', 
    border: 'border-threat-high/30 hover:border-threat-high/60', 
    text: 'text-threat-high', 
    badge: 'bg-threat-high/20 border-threat-high/50 text-threat-high',
    icon: 'text-threat-high',
    glow: 'shadow-lg shadow-threat-high/20'
  };
  if (level === 'medium') return { 
    bg: 'from-threat-medium/10', 
    border: 'border-threat-medium/30 hover:border-threat-medium/60', 
    text: 'text-threat-medium', 
    badge: 'bg-threat-medium/20 border-threat-medium/50 text-threat-medium',
    icon: 'text-threat-medium',
    glow: 'shadow-lg shadow-threat-medium/20'
  };
  return { 
    bg: 'from-threat-low/10', 
    border: 'border-threat-low/30 hover:border-threat-low/60', 
    text: 'text-threat-low', 
    badge: 'bg-threat-low/20 border-threat-low/50 text-threat-low',
    icon: 'text-threat-low',
    glow: 'shadow-lg shadow-threat-low/20'
  };
};

const getThreatLabel = (threatScore, threatLevel) => {
  if (threatLevel) {
    return threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1);
  }
  if (threatScore >= 7) return 'High';
  if (threatScore >= 4) return 'Medium';
  return 'Low';
};

const UpdateCard = ({ update, delay = 0 }) => {
  const threatColor = getThreatColor(update.threat_score || 0, update.threat_level);
  const [feedbackType, setFeedbackType] = useState("Useful");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

      setFeedbackMessage("✓ Feedback submitted successfully.");
      setComment("");
      setRating(5);
      setFeedbackType("Useful");
    } catch (error) {
      console.error(error);
      setFeedbackMessage("✗ Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -8 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${threatColor.bg} to-dark-bg border ${threatColor.border} backdrop-blur-xl p-6 transition-all duration-300 group h-full flex flex-col ${threatColor.glow}`}
      >
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${threatColor.text.split('-')[1]} to-transparent opacity-50`} />

        {/* Content */}
        <div className="relative z-10 space-y-4 flex-grow flex flex-col">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-grow">
              {/* Company and Domain */}
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold text-neon-cyan">
                  Company: {update.competitor_name || 'Unknown'}
                </p>
              </div>

              {/* Title */}
              <h3 className="text-white font-bold text-sm group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2 mb-1">
                {update.title || 'Untitled Update'}
              </h3>

              {/* Domain Badge */}
              {update.competitor_domain && (
                <p className="text-xs text-slate-400">
                  Domain: <span className="text-neon-cyan font-semibold">{update.competitor_domain}</span>
                </p>
              )}
            </div>

            {/* Threat Icon */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`flex-shrink-0 p-2 rounded-lg bg-white/5 border ${threatColor.text === 'text-threat-high' ? 'border-threat-high/30' : threatColor.text === 'text-threat-medium' ? 'border-threat-medium/30' : 'border-threat-low/30'}`}
            >
              <AlertCircle className={`w-5 h-5 ${threatColor.icon}`} />
            </motion.div>
          </div>

          {/* Summary */}
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
            {update.summary || update.description || 'No summary available'}
          </p>

          {/* Category and Source Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {update.category && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 text-neon-purple border border-neon-purple/40 whitespace-nowrap"
              >
                {update.category === 'Pricing Change' ? '💰 ' : ''}
                {update.category}
              </motion.span>
            )}
            {update.source_type && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-blue/20 text-neon-blue border border-neon-blue/40 whitespace-nowrap"
              >
                {update.source_type}
              </motion.span>
            )}
          </div>

          {/* Threat Score and Details */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-border/30">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 font-bold text-lg ${threatColor.badge}`}>
                {update.threat_score !== undefined ? `${update.threat_score}/10` : 'N/A'}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Threat Level</p>
                <p className={`text-sm font-bold ${threatColor.text}`}>
                  {getThreatLabel(update.threat_score || 0, update.threat_level)} Risk
                </p>
              </div>
            </div>

            {/* Source Link */}
            {update.url && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                href={update.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:text-neon-blue transition-colors duration-300 p-2 rounded-lg hover:bg-neon-cyan/10"
              >
                <ExternalLink size={18} />
              </motion.a>
            )}
          </div>

          {/* Threat Reason */}
          {update.threat_reason && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-slate-400 italic border-l-2 border-neon-purple/40 pl-3 py-2"
            >
              <p className="font-semibold text-slate-300 mb-1">Why this matters:</p>
              {update.threat_reason}
            </motion.div>
          )}

          {/* Prediction Section */}
          {update.prediction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 p-3 space-y-2 mt-2"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-cyan" />
                <h4 className="text-xs font-bold text-neon-cyan">Predicted Next Move</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{update.prediction}</p>
              {update.confidence_level && (
                <p className="text-xs text-slate-400 font-semibold">
                  Confidence: <span className="text-neon-cyan">{update.confidence_level}</span>
                </p>
              )}
            </motion.div>
          )}

          {/* Recommended Response Section */}
          {update.recommended_response && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg border border-neon-purple/30 bg-neon-purple/10 p-3 space-y-2 mt-2"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-neon-purple" />
                <h4 className="text-xs font-bold text-neon-purple">Recommended Response</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{update.recommended_response}</p>
            </motion.div>
          )}

          {/* View Details Button */}
          <motion.button
            onClick={() => setShowDetails(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 border border-neon-cyan/40 hover:border-neon-cyan/70 text-neon-cyan hover:text-neon-blue font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Read Full Analysis
          </motion.button>

          {/* Feedback Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-500/20">
                <Lightbulb className="w-4 h-4 text-blue-300" />
              </div>
              <p className="text-xs font-bold text-blue-300">Help Improve ACIA</p>
            </div>

            <div className="space-y-3">
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full bg-dark-card border border-dark-border/50 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-neon-blue/50 transition-colors"
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
                className="w-full bg-dark-card border border-dark-border/50 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-neon-blue/50 transition-colors"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Bad</option>
              </select>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional feedback..."
                className="w-full bg-dark-card border border-dark-border/50 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-neon-blue/50 transition-colors min-h-[60px] resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitFeedback}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300"
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </motion.button>

              {feedbackMessage && (
                <p className={`text-xs font-semibold ${feedbackMessage.startsWith('✓') ? 'text-threat-low' : 'text-threat-high'}`}>
                  {feedbackMessage}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Update Details Modal */}
      {showDetails && (
        <UpdateDetailsModal 
          update={update} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
};

export default UpdateCard;
