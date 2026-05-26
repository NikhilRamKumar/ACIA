import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertCircle, Zap, Lightbulb, Brain } from 'lucide-react';

const getThreatBadgeColor = (threatLevel) => {
  if (!threatLevel) return 'bg-slate-700/20 text-slate-300 border-slate-600/50';
  const level = threatLevel.toLowerCase();
  if (level === 'high') return 'bg-threat-high/20 text-threat-high border-threat-high/50';
  if (level === 'medium') return 'bg-threat-medium/20 text-threat-medium border-threat-medium/50';
  return 'bg-threat-low/20 text-threat-low border-threat-low/50';
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return date;
  }
};

const SectionCard = ({ title, children, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-neon-blue/20 bg-gradient-to-br from-dark-card/50 to-dark-bg/50 p-5 space-y-3 hover:border-neon-cyan/30 transition-all"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-neon-blue/20">
            <Icon className="w-5 h-5 text-neon-cyan" />
          </div>
        )}
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="text-sm text-slate-300 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};

const UpdateDetailsModal = ({ update, onClose }) => {
  if (!update) return null;

  const threatBadgeColor = getThreatBadgeColor(update.threat_level);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
      >
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-b from-dark-bg to-[#0a0e1a] border border-neon-blue/20 rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-gradient-to-b from-dark-bg to-dark-bg/80 border-b border-neon-blue/10 backdrop-blur-xl px-8 py-6 flex items-start justify-between gap-4">
            <motion.div className="flex-1 space-y-3">
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent leading-tight pr-8">
                  {update.title || 'Untitled Update'}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="p-2 rounded-lg bg-neon-blue/20">
                    <Zap className="w-4 h-4 text-neon-cyan" />
                  </div>
                  <p className="text-sm text-neon-cyan font-bold">
                    {update.competitor_name || 'Unknown Competitor'}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {update.competitor_domain && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                    {update.competitor_domain}
                  </span>
                )}
                {update.source_type && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                    {update.source_type}
                  </span>
                )}
                {update.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30">
                    {update.category}
                  </span>
                )}
                {update.threat_score !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${threatBadgeColor}`}>
                    {update.threat_score}/10 - {update.threat_level || 'Unknown'}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-dark-card rounded-lg transition-colors duration-200 text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Content Scroll Area */}
          <div className="overflow-y-auto flex-1">
            <div className="px-8 py-6 space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {update.threat_score !== undefined && (
                  <div className="rounded-lg bg-dark-card/50 border border-dark-border/50 p-4">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Threat Score</p>
                    <p className={`text-2xl font-black ${
                      update.threat_score >= 7 ? 'text-threat-high' :
                      update.threat_score >= 4 ? 'text-threat-medium' :
                      'text-threat-low'
                    }`}>
                      {update.threat_score}/10
                    </p>
                  </div>
                )}
                {update.confidence_level && (
                  <div className="rounded-lg bg-dark-card/50 border border-dark-border/50 p-4">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Confidence</p>
                    <p className="text-2xl font-black text-neon-cyan">{update.confidence_level}</p>
                  </div>
                )}
                {update.published_date && (
                  <div className="rounded-lg bg-dark-card/50 border border-dark-border/50 p-4">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Published</p>
                    <p className="text-xs text-slate-300 font-mono">{formatDate(update.published_date).split(',')[0]}</p>
                  </div>
                )}
                {update.category && (
                  <div className="rounded-lg bg-dark-card/50 border border-dark-border/50 p-4">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Category</p>
                    <p className="text-xs text-neon-cyan font-mono">{update.category}</p>
                  </div>
                )}
              </motion.div>

              {/* Source Information */}
              <SectionCard title="Source Information" icon={ExternalLink}>
                <div className="space-y-3">
                  {update.url ? (
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0 font-semibold">URL:</span>
                      <a
                        href={update.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-cyan hover:text-neon-blue transition-colors duration-200 break-all underline hover:underline-offset-2"
                      >
                        {update.url}
                      </a>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic">No URL available</div>
                  )}
                  {update.scraped_at && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-semibold">Scraped:</span>
                      <span className="text-slate-300">{formatDate(update.scraped_at)}</span>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* AI Summary */}
              {(update.summary || update.description) && (
                <SectionCard title="Intelligence Summary" icon={Brain}>
                  <p className="text-slate-300 leading-relaxed">
                    {update.summary || update.description}
                  </p>
                </SectionCard>
              )}

              {/* Full Content */}
              {update.content && (
                <SectionCard title="Original Update Content" icon={ExternalLink}>
                  <div className="bg-dark-bg/80 rounded-lg p-4 border border-dark-border/50 max-h-40 overflow-y-auto text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {update.content}
                  </div>
                </SectionCard>
              )}

              {/* Threat Analysis */}
              {update.threat_reason && (
                <SectionCard title="Why This Matters" icon={AlertCircle}>
                  <p className="text-slate-300 leading-relaxed">
                    {update.threat_reason}
                  </p>
                </SectionCard>
              )}

              {/* Risk Explanation */}
              {update.risk_explanation && (
                <SectionCard title="Risk Assessment" icon={Zap}>
                  <p className="text-slate-300 leading-relaxed">
                    {update.risk_explanation}
                  </p>
                </SectionCard>
              )}

              {/* Predicted Next Move */}
              {update.prediction && (
                <SectionCard title="Predicted Next Move" icon={Brain}>
                  <div className="space-y-3">
                    <p className="text-slate-300 leading-relaxed">{update.prediction}</p>
                    {update.confidence_level && (
                      <div className="flex items-center gap-2 text-xs pt-2 border-t border-dark-border/30">
                        <span className="text-slate-400 font-semibold">Confidence:</span>
                        <span className="text-neon-cyan font-bold">{update.confidence_level}</span>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* Recommended Response */}
              {update.recommended_response && (
                <SectionCard title="Recommended Strategic Response" icon={Lightbulb}>
                  <p className="text-slate-300 leading-relaxed">
                    {update.recommended_response}
                  </p>
                </SectionCard>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gradient-to-t from-dark-bg to-dark-bg/80 border-t border-neon-blue/10 backdrop-blur-xl px-8 py-4 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/40 hover:border-neon-cyan/70 text-neon-cyan font-semibold transition-all duration-300"
            >
              Close Modal
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateDetailsModal;
