import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUpdates } from '../services/api';
import UpdateCard from '../components/UpdateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { AlertTriangle, Search, Filter } from 'lucide-react';

const Updates = () => {
  const selectedDomain = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';
  const selectedDomainKey = localStorage.getItem('aciaSelectedDomain');
  
  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedThreatLevel, setSelectedThreatLevel] = useState('all');
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    loadUpdates();
  }, []);

  useEffect(() => {
    filterUpdates();
  }, [updates, searchTerm, selectedCategory, selectedThreatLevel]);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const data = await getUpdates(selectedDomainKey);
      const updatesList = Array.isArray(data) ? data : data?.data || [];
      setUpdates(updatesList);

      // Extract unique categories
      const uniqueCategories = [...new Set(updatesList.map(u => u.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading updates:', error);
      showToast('Failed to load updates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUpdates = () => {
    let filtered = updates;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.title?.toLowerCase().includes(term) ||
          u.summary?.toLowerCase().includes(term) ||
          u.description?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(u => u.category === selectedCategory);
    }

    // Filter by threat level
    if (selectedThreatLevel !== 'all') {
      const score = parseInt(selectedThreatLevel);
      if (score === 1) {
        filtered = filtered.filter(u => (u.threat_score || 0) < 4);
      } else if (score === 2) {
        filtered = filtered.filter(u => (u.threat_score || 0) >= 4 && (u.threat_score || 0) < 7);
      } else if (score === 3) {
        filtered = filtered.filter(u => (u.threat_score || 0) >= 7);
      }
    }

    // Sort by threat score (highest first)
    filtered.sort((a, b) => (b.threat_score || 0) - (a.threat_score || 0));

    setFilteredUpdates(filtered);
  };

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4">
        <LoadingSpinner fullScreen text="Loading Updates..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 text-threat-high" />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
              {selectedDomain} Updates
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Monitor {updates.length} recent competitor activities in {selectedDomain}</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-cyan/50" />
            <input
              type="text"
              placeholder="Search updates by title or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all duration-300"
            />
          </div>

          {/* Filter Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                  <Filter size={16} />
                  Filter by Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white'
                        : 'bg-dark-card border border-dark-border/50 text-slate-300 hover:border-neon-blue/50'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-neon-purple to-neon-violet text-white'
                          : 'bg-dark-card border border-dark-border/50 text-slate-300 hover:border-neon-purple/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Threat Level Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Filter by Threat Level
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedThreatLevel('all')}
                  className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                    selectedThreatLevel === 'all'
                      ? 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white'
                      : 'bg-dark-card border border-dark-border/50 text-slate-300 hover:border-neon-blue/50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedThreatLevel('1')}
                  className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                    selectedThreatLevel === '1'
                      ? 'bg-threat-low text-white'
                      : 'bg-dark-card border border-threat-low/30 text-threat-low hover:border-threat-low/50'
                  }`}
                >
                  Low
                </button>
                <button
                  onClick={() => setSelectedThreatLevel('2')}
                  className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                    selectedThreatLevel === '2'
                      ? 'bg-threat-medium text-white'
                      : 'bg-dark-card border border-threat-medium/30 text-threat-medium hover:border-threat-medium/50'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setSelectedThreatLevel('3')}
                  className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                    selectedThreatLevel === '3'
                      ? 'bg-threat-high text-white'
                      : 'bg-dark-card border border-threat-high/30 text-threat-high hover:border-threat-high/50'
                  }`}
                >
                  High
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-400">
            Showing {filteredUpdates.length} of {updates.length} updates
          </p>
        </motion.div>

        {/* Updates List */}
        {filteredUpdates.length > 0 ? (
          <div className="space-y-4">
            {filteredUpdates.map((update, index) => (
              <UpdateCard key={update.id || index} update={update} delay={0.3 + index * 0.05} />
            ))}
          </div>
        ) : updates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <AlertTriangle size={64} className="mx-auto mb-4 opacity-30 text-slate-500" />
            <p className="text-lg text-slate-300 mb-2">No updates found for this domain yet.</p>
            <p className="text-sm text-slate-500">Run scraper or add competitors for {selectedDomain} to see updates.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <AlertTriangle size={64} className="mx-auto mb-4 opacity-30 text-slate-500" />
            <p className="text-lg text-slate-300">No updates found matching your search criteria.</p>
          </motion.div>
        )}
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

export default Updates;
