import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-glass flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="relative w-16 h-16"
            >
              <div className="absolute inset-0 rounded-full border-2 border-dark-border" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue border-r-neon-cyan" />
            </motion.div>
          </div>
          <p className="text-neon-cyan font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="relative w-12 h-12"
      >
        <div className="absolute inset-0 rounded-full border-2 border-dark-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue border-r-neon-cyan" />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
