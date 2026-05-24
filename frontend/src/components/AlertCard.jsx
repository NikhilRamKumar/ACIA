import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AlertCard = ({ alert, onMarkAsRead }) => {
  // Determine severity color and glow
  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'High':
        return {
          borderColor: '#ff1744',
          bgGlow: 'from-red-500/10 to-red-600/5',
          badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/50',
          icon: 'text-red-400',
          glow: 'shadow-lg shadow-red-500/20'
        };
      case 'Medium':
        return {
          borderColor: '#ffb300',
          bgGlow: 'from-yellow-500/10 to-yellow-600/5',
          badgeColor: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
          icon: 'text-yellow-400',
          glow: 'shadow-lg shadow-yellow-500/20'
        };
      case 'Low':
      default:
        return {
          borderColor: '#00f0ff',
          bgGlow: 'from-cyan-500/10 to-blue-600/5',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50',
          icon: 'text-cyan-400',
          glow: 'shadow-lg shadow-cyan-500/20'
        };
    }
  };

  const severity = getSeverityStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-r ${severity.bgGlow} border-l-4 p-6 rounded-lg backdrop-blur-glass ${severity.glow}`}
      style={{ borderLeftColor: severity.borderColor }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 mt-1 ${severity.icon}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-white">{alert.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${severity.badgeColor}`}>
                  {alert.alert_type}
                </span>
              </div>

              {alert.message && (
                <p className="text-slate-300 text-sm mb-3">{alert.message}</p>
              )}

              {/* Alert metadata */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.created_at).toLocaleDateString()} {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {alert.is_read && (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    Read
                  </div>
                )}
                {!alert.is_read && (
                  <div className="px-2 py-1 bg-neon-blue/20 border border-neon-blue/50 rounded text-neon-blue">
                    Unread
                  </div>
                )}
              </div>
            </div>

            {/* Mark as read button */}
            {!alert.is_read && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMarkAsRead(alert.id)}
                className="flex-shrink-0 px-4 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded hover:bg-neon-blue/30 transition-colors text-neon-blue text-sm font-medium"
              >
                Mark Read
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
