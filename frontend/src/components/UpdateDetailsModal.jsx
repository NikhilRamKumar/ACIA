import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const getThreatBadgeColor = (threatLevel) => {
  // Use threat_level string from backend if available
  if (!threatLevel) return 'bg-slate-700 text-slate-300';
  const level = threatLevel.toLowerCase();
  if (level === 'high') return 'bg-red-900/30 text-red-300 border border-red-500/50';
  if (level === 'medium') return 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/50';
  return 'bg-green-900/30 text-green-300 border border-green-500/50';
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
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 space-y-3 hover:border-slate-600/50 transition-all">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-neon-cyan" />}
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      </div>
      <div className="text-sm text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-950 border border-cyan-500/20 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800/50 px-8 py-6 flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight pr-8">
                  {update.title || 'Untitled Update'}
                </h2>
                <p className="text-sm text-neon-cyan font-semibold mt-2">
                  {update.competitor_name || 'Unknown Competitor'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {update.competitor_domain && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 text-slate-300">
                    Domain: {update.competitor_domain}
                  </span>
                )}
                {update.source_type && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/30">
                    📊 {update.source_type}
                  </span>
                )}
                {update.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-neon-purple/10 text-neon-purple border border-neon-purple/30">
                    {update.category === 'Pricing Change' ? '💰 Pricing Change' : update.category}
                  </span>
                )}
                {update.threat_score !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${threatBadgeColor}`}>
                    {update.threat_score}/10 - {update.threat_level || 'Unknown'}
                  </span>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-6">
            {/* Source Information */}
            <SectionCard title="Source Information" icon={ExternalLink}>
              <div className="space-y-2">
                {update.url ? (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 flex-shrink-0">URL:</span>
                    <a
                      href={update.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:text-neon-blue transition-colors duration-200 break-all underline"
                    >
                      {update.url}
                    </a>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">No URL available</div>
                )}
                {update.published_date && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Published:</span>
                    <span className="text-slate-300">{formatDate(update.published_date)}</span>
                  </div>
                )}
                {update.scraped_at && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Scraped:</span>
                    <span className="text-slate-300">{formatDate(update.scraped_at)}</span>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Full Content */}
            <SectionCard title="Original Update Content">
              {update.content ? (
                <div className="whitespace-pre-line max-h-64 overflow-y-auto bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
                  {update.content}
                </div>
              ) : (
                <div className="text-slate-500 italic">
                  No full content available. The scraper may have collected only the title or summary.
                </div>
              )}
            </SectionCard>

            {/* AI Summary */}
            <SectionCard title="AI Summary">
              {update.summary ? (
                <div className="text-slate-300">
                  {update.summary}
                </div>
              ) : (
                <div className="text-slate-500 italic">
                  Summary not generated yet.
                </div>
              )}
            </SectionCard>

            {/* What This Means */}
            <SectionCard title="What This Means">
              <div className="space-y-3 text-slate-300">
                {update.risk_explanation ? (
                  <p>{update.risk_explanation}</p>
                ) : (
                  <div className="space-y-2">
                    {update.category && (
                      <p>
                        <span className="text-slate-400">Category:</span> This update is categorized as <span className="font-semibold text-neon-purple">{update.category}</span>, which means ACIA detected this as a strategic movement related to product, pricing, market, model, or business activity.
                      </p>
                    )}
                    {update.threat_level && (
                      <p>
                        <span className="text-slate-400">Threat Level:</span> With a <span className="font-semibold">{update.threat_level}</span> threat level ({update.threat_score}/10), {
                          update.threat_level.toLowerCase() === 'high' 
                            ? "this update may have strong competitive impact and should be monitored closely." 
                            : update.threat_level.toLowerCase() === 'medium'
                            ? "this update has moderate competitive significance and warrants attention."
                            : "this update has low immediate competitive impact but may be part of a broader trend."
                        }
                      </p>
                    )}
                    {!update.category && !update.threat_level && (
                      <div className="text-slate-500 italic">
                        Additional context not available.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Threat Analysis */}
            {update.threat_reason && (
              <SectionCard title="Threat Analysis">
                <div className="text-slate-300">
                  {update.threat_reason}
                </div>
              </SectionCard>
            )}

            {/* Predicted Next Move */}
            {update.prediction && (
              <SectionCard title="Predicted Next Move">
                <div className="space-y-2">
                  <p className="text-slate-300">{update.prediction}</p>
                  {update.confidence_level && (
                    <p className="text-xs text-slate-400">
                      Confidence Level: <span className="font-semibold">{update.confidence_level}</span>
                    </p>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Recommended Response */}
            {update.recommended_response && (
              <SectionCard title="Recommended Strategic Response">
                <div className="text-slate-300">
                  {update.recommended_response}
                </div>
              </SectionCard>
            )}

            {/* Additional Metadata */}
            <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-500">Update ID</div>
                  <div className="text-slate-300 font-mono">{update.id}</div>
                </div>
                <div>
                  <div className="text-slate-500">Competitor ID</div>
                  <div className="text-slate-300 font-mono">{update.competitor_id}</div>
                </div>
                {update.source_type && (
                  <div>
                    <div className="text-slate-500">Source Type</div>
                    <div className="text-slate-300 font-mono">{update.source_type}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-950 border-t border-slate-800/50 px-8 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateDetailsModal;
