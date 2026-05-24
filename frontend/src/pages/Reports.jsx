import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateReport } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { FileText, Download, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';

const Reports = () => {
  const selectedDomain = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';
  const selectedDomainKey = localStorage.getItem('aciaSelectedDomain');

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info',
  });

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const data = await generateReport(selectedDomainKey, days);
      setReport(data);
      showToast('Report generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            <FileText className="w-10 h-10 text-neon-cyan" />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
              AI-Generated Intelligence Report
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Generate structured competitor intelligence from recent market activity.</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 bg-gradient-to-r from-dark-card/50 to-dark-bg border border-dark-border/50 backdrop-blur-glass rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time Window
              </label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                disabled={loading}
                className="w-full bg-dark-bg border border-slate-700/50 text-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-cyan/50 disabled:opacity-50"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateReport}
              disabled={loading}
              className="mt-6 md:mt-0 px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-bold text-dark-bg hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">
                    <Zap className="w-5 h-5" />
                  </div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Report Content */}
        {report ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Executive Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-gradient-to-r from-dark-card/50 to-dark-bg border border-neon-cyan/20 backdrop-blur-glass rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-neon-cyan" />
                Executive Summary
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">{report.executive_summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-sm text-slate-400">Total Updates</p>
                  <p className="text-3xl font-bold text-neon-cyan">{report.total_updates}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Time Window</p>
                  <p className="text-3xl font-bold text-neon-blue">{report.time_window_days} days</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Generated</p>
                  <p className="text-sm text-neon-purple font-medium">
                    {new Date(report.generated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Strategic Insight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border border-neon-cyan/30 rounded-xl p-8"
            >
              <div className="flex gap-3">
                <Target className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Strategic Insight</h3>
                  <p className="text-slate-300">{report.strategic_insight}</p>
                </div>
              </div>
            </motion.div>

            {/* Top Competitors */}
            {report.top_competitors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-gradient-to-r from-dark-card/50 to-dark-bg border border-dark-border/50 backdrop-blur-glass rounded-xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-neon-blue" />
                  Top Competitors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.top_competitors.map((comp, idx) => (
                    <div key={idx} className="bg-dark-bg/50 border border-slate-700/50 rounded-lg p-4">
                      <p className="text-white font-semibold">{comp.competitor}</p>
                      <p className="text-slate-400 text-sm">{comp.count} updates</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Threat Distribution */}
            {report.threat_distribution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-gradient-to-r from-dark-card/50 to-dark-bg border border-dark-border/50 backdrop-blur-glass rounded-xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  Threat Distribution
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-dark-bg/50 border border-green-500/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-400">Low</p>
                    <p className="text-3xl font-bold text-green-400">{report.threat_distribution.low}</p>
                  </div>
                  <div className="bg-dark-bg/50 border border-yellow-500/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-400">Medium</p>
                    <p className="text-3xl font-bold text-yellow-400">{report.threat_distribution.medium}</p>
                  </div>
                  <div className="bg-dark-bg/50 border border-red-500/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-400">High</p>
                    <p className="text-3xl font-bold text-red-400">{report.threat_distribution.high}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Top Categories */}
            {report.top_categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-gradient-to-r from-dark-card/50 to-dark-bg border border-dark-border/50 backdrop-blur-glass rounded-xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Top Categories</h3>
                <div className="space-y-2">
                  {report.top_categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 min-w-40">{cat.category}</span>
                      <div className="flex-grow bg-slate-700/30 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(cat.count / (report.top_categories[0]?.count || 1)) * 100}%`,
                          }}
                          transition={{ delay: idx * 0.1, duration: 0.6 }}
                          className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-300 min-w-8">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* High Threat Updates */}
            {report.high_threat_updates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-gradient-to-r from-red-500/10 to-dark-bg border border-red-500/20 backdrop-blur-glass rounded-xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  High Threat Updates
                </h3>
                <div className="space-y-3">
                  {report.high_threat_updates.slice(0, 5).map((update, idx) => (
                    <div key={idx} className="bg-dark-bg/50 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-white">{update.title}</p>
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-bold">
                          {update.threat_score}/10
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{update.competitor}</p>
                      {update.summary && (
                        <p className="text-xs text-slate-500 line-clamp-2">{update.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommended Actions */}
            {report.recommended_actions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10 border border-neon-blue/30 backdrop-blur-glass rounded-xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-neon-blue" />
                  Recommended Actions
                </h3>
                <ul className="space-y-2">
                  {report.recommended_actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <span className="text-neon-blue font-bold mt-1">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Report Generated</h3>
            <p className="text-slate-400">Click "Generate Report" to create an intelligence report.</p>
          </motion.div>
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

export default Reports;
