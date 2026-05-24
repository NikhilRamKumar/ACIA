import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const ActionButton = ({ children, onClick, loading = false, variant = 'primary', icon: Icon, delay = 0 }) => {
  const variants = {
    primary: 'from-neon-blue to-neon-cyan',
    secondary: 'from-neon-purple to-neon-violet',
    success: 'from-neon-green to-neon-blue',
    danger: 'from-threat-high to-threat-medium',
  };

  const glowClass = {
    primary: 'group-hover:shadow-glow-blue',
    secondary: 'group-hover:shadow-glow-purple',
    success: 'group-hover:shadow-glow-green',
    danger: 'group-hover:shadow-glow-red',
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={`relative group overflow-hidden rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${glowClass[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${variants[variant]} opacity-100 group-hover:opacity-110 transition-opacity duration-300`} />

      {/* Animated shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s infinite',
        }} />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 text-white">
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4"
            >
              <Zap size={16} />
            </motion.div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            {Icon && <Icon size={18} className="group-hover:scale-110 transition-transform" />}
            {children}
          </>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000% 0; }
          100% { background-position: 1000% 0; }
        }
      `}</style>
    </motion.button>
  );
};

export default ActionButton;
