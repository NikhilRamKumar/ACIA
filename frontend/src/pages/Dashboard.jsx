import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  getCompetitors,
  getUpdates,
  scrapeDomainCompetitors,
  summarizeAllUpdates,
  analyzeAllUpdates,
  predictAllUpdates,
  detectPricingChanges,
  getMarketTrendSummary,
} from '../services/api';
import StatCard from '../components/StatCard';
import ActionButton from '../components/ActionButton';
import UpdateCard from '../components/UpdateCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import MarketTrendSummary from '../components/MarketTrendSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Zap, Brain, Database, Tag } from 'lucide-react';

const getDomainSubtitle = (domainName) => {
  const subtitles = {
    'AI / GenAI': 'Monitoring model releases, AI labs, pricing changes, RAG platforms, developer tools, and strategic AI market movements.',
    'Mobile Phones': 'Monitoring smartphone launches, feature upgrades, AI phone features, camera improvements, pricing changes, and regional releases.',
    'Electric Vehicles': 'Monitoring EV launches, battery innovation, charging networks, pricing moves, and market expansion.',
    'SaaS Products': 'Monitoring SaaS feature launches, integrations, pricing updates, enterprise features, and product positioning.',
    'E-commerce': 'Monitoring marketplace updates, seller tools, logistics changes, pricing moves, and customer experience strategies.',
    'FinTech': 'Monitoring payment products, lending updates, banking features, regulations, and fintech partnerships.',
  };
  return subtitles[domainName] || 'Monitoring competitor movements, market signals, predictions, and strategic threats.';
};

const Dashboard = () => {
  const selectedDomain = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';
  const selectedDomainKey = localStorage.getItem('aciaSelectedDomain');
  
  const [stats, setStats] = useState({
    totalCompetitors: 0,
    totalUpdates: 0,
    highThreatUpdates: 0,
    analyzedUpdates: 0,
  });
  const [allUpdates, setAllUpdates] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    scrape: false,
    summarize: false,
    analyze: false,
    predict: false,
    pricing: false,
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info',
  });
  const [trendData, setTrendData] = useState(null);
  const [trendLoading, setTrendLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [competitorsData, updatesData] = await Promise.all([
        getCompetitors(selectedDomainKey),
        getUpdates(selectedDomainKey),
      ]);

      const competitors = Array.isArray(competitorsData) ? competitorsData : competitorsData?.data || [];
      const updates = Array.isArray(updatesData) ? updatesData : updatesData?.data || [];

      const highThreat = updates.filter(u => (u.threat_score || 0) >= 7).length;
      const analyzed = updates.filter(u => u.threat_score !== null && u.threat_score !== undefined).length;

      setStats({
        totalCompetitors: competitors.length,
        totalUpdates: updates.length,
        highThreatUpdates: highThreat,
        analyzedUpdates: analyzed,
      });

      setAllUpdates(updates);
      setRecentUpdates(updates.slice(0, 5));
      
      // Load trend data
      loadTrendData();
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendData = async () => {
    try {
      setTrendLoading(true);
      const data = await getMarketTrendSummary(selectedDomainKey, 30);
      setTrendData(data);
    } catch (error) {
      console.error('Error loading trend data:', error);
      // Don't show toast for trend errors - it's not critical
    } finally {
      setTrendLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const handleScrapeAll = async () => {
    try {
      if (!selectedDomainKey) {
        showToast('Please select a domain from the Domain Selection page first.', 'error');
        return;
      }

      // Show initial message explaining what's happening
      showToast(
        'Scraping started. This may take 1–2 minutes because ACIA checks all competitors in the selected domain, compares previous updates, skips duplicates, and stores only new updates.',
        'info'
      );

      setActionLoading(prev => ({ ...prev, scrape: true }));
      
      const result = await scrapeDomainCompetitors(selectedDomainKey);
      
      // Build appropriate message based on results
      let message = '';
      let toastType = 'success';
      
      if (result.saved_total > 0) {
        message = `Scraping completed. ${result.saved_total} new update${result.saved_total === 1 ? '' : 's'} found.`;
      } else if (result.failed_count > 0 || result.no_updates_count > 0) {
        message = 'Scraping completed. No new updates found. Some competitor websites may have blocked scraping or had no new content.';
        if (result.failed_count > 0) {
          message += ` ${result.failed_count} competitor${result.failed_count === 1 ? '' : 's'} could not be scraped due to timeout, blocking, or unavailable pages.`;
        }
      } else {
        message = 'Scraping completed. No new updates found.';
      }
      
      // Add summary of what happened
      const summaryParts = [];
      if (result.success_count > 0) summaryParts.push(`Success: ${result.success_count}`);
      if (result.failed_count > 0) summaryParts.push(`Failed: ${result.failed_count}`);
      if (result.skipped_count > 0) summaryParts.push(`Skipped: ${result.skipped_count}`);
      if (result.no_updates_count > 0) summaryParts.push(`No updates: ${result.no_updates_count}`);
      
      if (summaryParts.length > 0) {
        message += ` (${summaryParts.join(', ')})`;
      }
      
      showToast(message, toastType);
      
      setTimeout(loadDashboardData, 1500);
    } catch (error) {
      console.error('Error scraping domain:', error);
      
      // Check if it's a network timeout vs other error
      if (error.code === 'ECONNABORTED' || error.message === 'timeout of 180000ms exceeded') {
        showToast(
          'Scraping request timed out. This may happen if too many competitors have blocked scraping. Please try again later.',
          'error'
        );
      } else if (error.response && error.response.status >= 500) {
        showToast('Backend server error. Please try again.', 'error');
      } else if (error.response && error.response.status >= 400) {
        showToast('Invalid request. Please check your domain selection.', 'error');
      } else {
        showToast('Failed to scrape domain. Please try again.', 'error');
      }
    } finally {
      setActionLoading(prev => ({ ...prev, scrape: false }));
    }
  };

  const handleSummarizeAll = async () => {
    try {
      setActionLoading(prev => ({ ...prev, summarize: true }));
      await summarizeAllUpdates();
      showToast('Summarization started! Summaries will be generated shortly.', 'success');
      setTimeout(loadDashboardData, 2000);
    } catch (error) {
      console.error('Error summarizing:', error);
      showToast('Failed to start summarization. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, summarize: false }));
    }
  };

  const handleAnalyzeAll = async () => {
    try {
      setActionLoading(prev => ({ ...prev, analyze: true }));
      await analyzeAllUpdates();
      showToast('Analysis started! Threat scores will be calculated shortly.', 'success');
      setTimeout(loadDashboardData, 2000);
    } catch (error) {
      console.error('Error analyzing:', error);
      showToast('Failed to start analysis. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, analyze: false }));
    }
  };

  const handlePredictAll = async () => {
    try {
      setActionLoading(prev => ({ ...prev, predict: true }));
      const result = await predictAllUpdates();
      showToast(result.message || 'Prediction completed successfully!', 'success');
      setTimeout(loadDashboardData, 2000);
    } catch (error) {
      console.error('Error predicting:', error);
      showToast('Failed to start prediction. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, predict: false }));
    }
  };

  const handleDetectPricing = async () => {
    try {
      setActionLoading(prev => ({ ...prev, pricing: true }));
      const result = await detectPricingChanges();
      showToast(`Pricing detection complete! Updated: ${result.updated}, Detected: ${result.detected}`, 'success');
      setTimeout(loadDashboardData, 2000);
    } catch (error) {
      console.error('Error detecting pricing:', error);
      showToast('Failed to detect pricing changes. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, pricing: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4">
        <LoadingSpinner fullScreen text="Loading Intelligence Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-[#0f172a] to-black pt-20 px-4 pb-12">
      {/* Animated background blobs */}
      <motion.div
        className="fixed top-0 -left-1/4 w-96 h-96 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 border border-neon-cyan/30">
              <p className="text-neon-cyan text-xs font-semibold">Intelligence Dashboard</p>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
              {selectedDomain} Intelligence Center
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            {getDomainSubtitle(selectedDomain)}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            icon={Database}
            title="Total Competitors"
            value={stats.totalCompetitors}
            subtitle="Tracked competitors"
            delay={0.2}
          />
          <StatCard
            icon={Activity}
            title="Total Updates"
            value={stats.totalUpdates}
            subtitle="Competitor updates"
            delay={0.25}
          />
          <StatCard
            icon={AlertTriangle}
            title="High Threat"
            value={stats.highThreatUpdates}
            subtitle="Updates requiring attention"
            delay={0.3}
          />
          <StatCard
            icon={CheckCircle}
            title="Analyzed"
            value={stats.analyzedUpdates}
            subtitle="Updates with threat scores"
            delay={0.35}
          />
        </motion.div>

        {/* Action Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-dark-card/60 to-dark-bg/60 border border-neon-blue/20 p-8">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(45deg, #00d4ff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20"
                >
                  <Zap className="w-5 h-5 text-neon-cyan" />
                </motion.div>
                Domain Intelligence Operations
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Execute AI analysis, threat detection, and market forecasting for {selectedDomain}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <ActionButton
                  icon={Database}
                  onClick={handleScrapeAll}
                  loading={actionLoading.scrape}
                  variant="primary"
                  delay={0.4}
                >
                  Scrape Domain
                </ActionButton>
                <ActionButton
                  icon={Brain}
                  onClick={handleSummarizeAll}
                  loading={actionLoading.summarize}
                  variant="secondary"
                  delay={0.45}
                >
                  Summarize
                </ActionButton>
                <ActionButton
                  icon={TrendingUp}
                  onClick={handleAnalyzeAll}
                  loading={actionLoading.analyze}
                  variant="success"
                  delay={0.5}
                >
                  Analyze Threats
                </ActionButton>
                <ActionButton
                  icon={Brain}
                  onClick={handlePredictAll}
                  loading={actionLoading.predict}
                  variant="primary"
                  delay={0.55}
                >
                  Predict Moves
                </ActionButton>
                <ActionButton
                  icon={Tag}
                  onClick={handleDetectPricing}
                  loading={actionLoading.pricing}
                  variant="primary"
                  delay={0.6}
                >
                  Pricing Intel
                </ActionButton>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Charts */}
        <AnalyticsCharts updates={allUpdates} />

        {/* Market Trend Summary */}
        <MarketTrendSummary trendData={trendData} loading={trendLoading} />

        {/* Recent Updates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20">
                <Activity className="w-5 h-5 text-neon-cyan" />
              </div>
              Recent Intelligence Updates
            </h2>
            {recentUpdates.length > 0 && (
              <span className="text-sm text-slate-400">Showing latest {recentUpdates.length} updates</span>
            )}
          </div>

          {recentUpdates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentUpdates.map((update, index) => (
                <UpdateCard key={update.id || index} update={update} delay={0.7 + index * 0.1} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center py-16 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-dark-card/40 to-dark-bg/40 border border-dark-border/30"
            >
              <div className="inline-block p-3 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 mb-4">
                <Activity size={32} className="text-neon-cyan" />
              </div>
              <p className="text-slate-400 text-lg mb-2">No updates available yet</p>
              <p className="text-slate-500 text-sm">
                Click "Scrape Domain" to collect competitor updates and generate intelligence
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Dashboard;
