import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCompetitors } from '../services/api';
import CompetitorCard from '../components/CompetitorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { Building2, Search } from 'lucide-react';

const Competitors = () => {
  const selectedDomain = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';
  const selectedDomainKey = localStorage.getItem('aciaSelectedDomain');
  
  const [competitors, setCompetitors] = useState([]);
  const [filteredCompetitors, setFilteredCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [industries, setIndustries] = useState([]);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    loadCompetitors();
  }, []);

  useEffect(() => {
    filterCompetitors();
  }, [competitors, searchTerm, selectedIndustry]);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      const data = await getCompetitors(selectedDomainKey);
      const competitorsList = Array.isArray(data) ? data : data?.data || [];
      setCompetitors(competitorsList);

      // Extract unique industries
      const uniqueIndustries = [...new Set(competitorsList.map(c => c.industry).filter(Boolean))];
      setIndustries(uniqueIndustries);
    } catch (error) {
      console.error('Error loading competitors:', error);
      showToast('Failed to load competitors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterCompetitors = () => {
    let filtered = competitors;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.name?.toLowerCase().includes(term) ||
          c.industry?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term)
      );
    }

    // Filter by industry
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(c => c.industry === selectedIndustry);
    }

    setFilteredCompetitors(filtered);
  };

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4">
        <LoadingSpinner fullScreen text="Loading Competitors..." />
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            <Building2 className="w-10 h-10 text-neon-blue" />
            <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent">
              {selectedDomain} Competitors
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Track and analyze {competitors.length} competitors in {selectedDomain}</p>
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
              placeholder="Search competitors by name, industry, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all duration-300"
            />
          </div>

          {/* Industry Filter */}
          {industries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedIndustry('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedIndustry === 'all'
                    ? 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white'
                    : 'bg-dark-card border border-dark-border/50 text-slate-300 hover:border-neon-blue/50'
                }`}
              >
                All Industries
              </button>
              {industries.map(industry => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedIndustry === industry
                      ? 'bg-gradient-to-r from-neon-purple to-neon-violet text-white'
                      : 'bg-dark-card border border-dark-border/50 text-slate-300 hover:border-neon-purple/50'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          <p className="text-sm text-slate-400">
            Showing {filteredCompetitors.length} of {competitors.length} competitors
          </p>
        </motion.div>

        {/* Competitors Grid */}
        {filteredCompetitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitors.map((competitor, index) => (
              <CompetitorCard key={competitor.id || index} competitor={competitor} delay={0.3 + index * 0.05} />
            ))}
          </div>
        ) : competitors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Building2 size={64} className="mx-auto mb-4 opacity-30 text-slate-500" />
            <p className="text-lg text-slate-300 mb-2">No competitors found for this domain yet.</p>
            <p className="text-sm text-slate-500">You can add competitors for {selectedDomain} from the backend seed script or admin tools.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Building2 size={64} className="mx-auto mb-4 opacity-30 text-slate-500" />
            <p className="text-lg text-slate-300">No competitors found matching your search criteria.</p>
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

export default Competitors;
