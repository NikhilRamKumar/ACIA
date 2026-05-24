import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeatureComparison } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { Zap, TrendingUp } from 'lucide-react';

const FeatureComparison = () => {
  const selectedDomain = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';
  const selectedDomainKey = localStorage.getItem('aciaSelectedDomain');

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const data = await getFeatureComparison(selectedDomainKey);
      setComparison(data);
    } catch (error) {
      console.error('Error loading comparison:', error);
      showToast('Failed to load feature comparison', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const getThreatBadgeStyle = (score) => {
    if (score >= 7) return 'bg-red-500/20 text-red-300 border border-red-500/50';
    if (score >= 4) return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50';
    return 'bg-green-500/20 text-green-300 border border-green-500/50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4">
        <LoadingSpinner fullScreen text="Loading Feature Comparison..." />
      </div>
    );
  }

  const competitors = comparison?.comparison || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            <Zap className="w-10 h-10 text-neon-cyan" />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Feature Comparison
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Compare competitor capabilities and strategic signals across the {selectedDomain} domain.</p>
        </motion.div>

        {/* Comparison Cards */}
        {competitors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Competitors</h3>
            <p className="text-slate-400">No competitors found for the selected domain.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor, index) => (
              <motion.div
                key={competitor.competitor_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-dark-card/80 to-dark-bg border border-neon-cyan/20 rounded-xl p-6 backdrop-blur-glass hover:border-neon-cyan/50 transition-all duration-300"
              >
                {/* Competitor Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {competitor.competitor_name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {competitor.domain && (
                      <span className="px-2 py-1 text-xs rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                        {competitor.domain}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getThreatBadgeStyle(competitor.highest_threat_score)}`}>
                      {competitor.highest_threat_score}/10
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">
                    Features ({competitor.feature_count})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {competitor.features.length > 0 ? (
                      competitor.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan/70 transition-colors"
                        >
                          {feature}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No features detected</span>
                    )}
                  </div>
                </div>

                {/* Top Categories */}
                {competitor.top_categories.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Top Categories</h3>
                    <div className="space-y-1">
                      {competitor.top_categories.map((cat, idx) => (
                        <p key={idx} className="text-xs text-slate-400">
                          • {cat}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Latest Update */}
                <div className="mb-4 pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Latest Update</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {competitor.latest_update_title}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                  <span>{competitor.update_count} updates</span>
                  <span className="text-neon-cyan font-medium">{competitor.feature_count} features</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      )}
    </div>
  );
};

export default FeatureComparison;
