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
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent">
              ACIA {selectedDomain} Intelligence Dashboard
            </span>
          </h1>
          <p className="text-slate-400 text-lg">{getDomainSubtitle(selectedDomain)}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Database}
            title="Total Competitors"
            value={stats.totalCompetitors}
            subtitle="Tracked competitors"
            delay={0}
          />
          <StatCard
            icon={Activity}
            title="Total Updates"
            value={stats.totalUpdates}
            subtitle="Competitor updates"
            delay={0.1}
          />
          <StatCard
            icon={AlertTriangle}
            title="High Threat"
            value={stats.highThreatUpdates}
            subtitle="Updates requiring attention"
            delay={0.2}
          />
          <StatCard
            icon={CheckCircle}
            title="Analyzed"
            value={stats.analyzedUpdates}
            subtitle="Updates with threat scores"
            delay={0.3}
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-dark-card to-dark-bg border border-dark-border/50 backdrop-blur-glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-neon-blue" />
              Intelligence Operations
            </h2>
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
                delay={0.5}
              >
                Summarize All
              </ActionButton>
              <ActionButton
                icon={TrendingUp}
                onClick={handleAnalyzeAll}
                loading={actionLoading.analyze}
                variant="success"
                delay={0.6}
              >
                Analyze All
              </ActionButton>
              <ActionButton
                icon={Brain}
                onClick={handlePredictAll}
                loading={actionLoading.predict}
                variant="primary"
                delay={0.7}
              >
                Predict All
              </ActionButton>
              <ActionButton
                icon={Tag}
                onClick={handleDetectPricing}
                loading={actionLoading.pricing}
                variant="warning"
                delay={0.8}
              >
                Detect Pricing
              </ActionButton>
            </div>
          </div>
        </motion.div>

        {/* Analytics Charts */}
        <AnalyticsCharts updates={allUpdates} />

        {/* Market Trend Summary */}
        <MarketTrendSummary trendData={trendData} loading={trendLoading} />

        {/* Recent Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-neon-cyan" />
              Recent Updates
            </h2>
          </div>
          
          {recentUpdates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentUpdates.map((update, index) => (
                <UpdateCard key={update.id || index} update={update} delay={0.7 + index * 0.1} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>No updates available yet. Try scraping competitors!</p>
            </div>
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
