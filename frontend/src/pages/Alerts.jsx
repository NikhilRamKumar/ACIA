import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAlerts, getAlerts } from '../services/api';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { Bell, Zap } from 'lucide-react';

const Alerts = () => {
  const selectedDomainName = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';
  const selectedDomainKey = localStorage.getItem('aciaSelectedDomain');

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await getAlerts(selectedDomainKey);
      const alertsList = Array.isArray(data) ? data : data?.data || [];
      setAlerts(alertsList);
    } catch (error) {
      console.error('Error loading alerts:', error);
      showToast('Failed to load alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAlerts = async () => {
    try {
      setGenerating(true);
      const result = await generateAlerts();
      showToast(`Alerts generated! Created: ${result.created}, Skipped: ${result.skipped}`, 'success');
      // Reload alerts after generation
      await loadAlerts();
    } catch (error) {
      console.error('Error generating alerts:', error);
      showToast('Failed to generate alerts', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      // Update local state immediately for better UX
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
      
      // Call API in background
      const response = await fetch(`http://127.0.0.1:8000/alerts/${alertId}/read`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark alert as read');
      }
      
      showToast('Alert marked as read', 'success');
    } catch (error) {
      console.error('Error marking alert as read:', error);
      // Reload to sync with server state
      loadAlerts();
      showToast('Failed to mark alert as read', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card pt-20 px-4">
        <LoadingSpinner fullScreen text="Loading Alerts..." />
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
                <Bell className="w-10 h-10 text-neon-cyan" />
                <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
                  {selectedDomainName} Alerts
                </span>
              </h1>
              <p className="text-slate-400 text-lg">
                {alerts.length} total alerts
                {unreadCount > 0 && (
                  <span className="ml-2 inline-block px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm font-medium">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateAlerts}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-bold text-dark-bg hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5" />
              {generating ? 'Generating...' : 'Generate Alerts'}
            </motion.button>
          </div>
        </motion.div>

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Alerts Yet</h3>
            <p className="text-slate-400 mb-8">
              Click "Generate Alerts" to create alerts from your updates
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AlertCard alert={alert} onMarkAsRead={handleMarkAsRead} />
                </motion.div>
              ))}
            </AnimatePresence>
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

export default Alerts;
