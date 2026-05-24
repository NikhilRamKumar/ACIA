import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, BarChart3, Zap } from 'lucide-react';

const MarketTrendSummary = ({ trendData, loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-dark-card to-dark-bg border border-dark-border/50 backdrop-blur-glass rounded-xl p-8 mb-12"
      >
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <Zap className="w-6 h-6 text-neon-cyan" />
          </div>
          <p className="text-slate-400 mt-2">Loading market trends...</p>
        </div>
      </motion.div>
    );
  }

  if (!trendData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="bg-gradient-to-r from-dark-card/50 to-dark-bg border border-neon-cyan/20 backdrop-blur-glass rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-neon-cyan" />
          <h2 className="text-2xl font-bold text-white">Market Trends</h2>
        </div>

        {/* Trend Summary */}
        <div className="mb-8">
          <p className="text-slate-300 leading-relaxed mb-4">
            {trendData.trend_summary}
          </p>
          <div className="flex items-start gap-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-neon-cyan">Strategic Insight: </span>
              {trendData.strategic_insight}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Updates */}
          <div className="bg-dark-bg/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Total Updates</p>
            <p className="text-2xl font-bold text-neon-cyan">{trendData.total_updates}</p>
            <p className="text-xs text-slate-500 mt-1">Last {trendData.days} days</p>
          </div>

          {/* Threat Distribution */}
          <div className="bg-dark-bg/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Threat Levels</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-green-300">Low</span>
                <span className="text-xs font-bold text-green-300">{trendData.threat_distribution.low}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-yellow-300">Medium</span>
                <span className="text-xs font-bold text-yellow-300">{trendData.threat_distribution.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-red-300">High</span>
                <span className="text-xs font-bold text-red-300">{trendData.threat_distribution.high}</span>
              </div>
            </div>
          </div>

          {/* Top Category */}
          <div className="bg-dark-bg/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Top Category</p>
            {trendData.top_categories.length > 0 ? (
              <>
                <p className="text-sm font-bold text-neon-purple truncate">
                  {trendData.top_categories[0].category}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {trendData.top_categories[0].count} updates
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500">No data</p>
            )}
          </div>

          {/* Top Competitor */}
          <div className="bg-dark-bg/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Most Active</p>
            {trendData.top_competitors.length > 0 ? (
              <>
                <p className="text-sm font-bold text-neon-blue truncate">
                  {trendData.top_competitors[0].competitor}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {trendData.top_competitors[0].count} updates
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500">No data</p>
            )}
          </div>
        </div>

        {/* Top Categories */}
        {trendData.top_categories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-neon-purple" />
              Top Categories
            </h3>
            <div className="space-y-2">
              {trendData.top_categories.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 min-w-32 truncate">{cat.category}</span>
                  <div className="flex-grow bg-slate-700/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / (trendData.top_categories[0]?.count || 1)) * 100}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300 min-w-8">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Competitors */}
        {trendData.top_competitors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-neon-cyan" />
              Top Competitors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {trendData.top_competitors.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-dark-bg/50 border border-neon-cyan/20 rounded-lg p-3"
                >
                  <p className="text-sm font-semibold text-neon-cyan">{comp.competitor}</p>
                  <p className="text-xs text-slate-500">{comp.count} updates</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MarketTrendSummary;
