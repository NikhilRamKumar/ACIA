import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const typeConfig = {
    success: {
      bg: 'from-threat-low/20',
      border: 'border-threat-low/50',
      icon: CheckCircle,
      color: 'text-threat-low',
      bgLight: 'bg-threat-low/10',
    },
    error: {
      bg: 'from-threat-high/20',
      border: 'border-threat-high/50',
      icon: AlertCircle,
      color: 'text-threat-high',
      bgLight: 'bg-threat-high/10',
    },
    info: {
      bg: 'from-neon-blue/20',
      border: 'border-neon-blue/50',
      icon: Info,
      color: 'text-neon-blue',
      bgLight: 'bg-neon-blue/10',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className={`fixed top-6 right-6 max-w-md rounded-lg bg-gradient-to-r ${config.bg} to-dark-bg border ${config.border} backdrop-blur-glass p-4 shadow-lg z-50`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${config.bgLight}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
