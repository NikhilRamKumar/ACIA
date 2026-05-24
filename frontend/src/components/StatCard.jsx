import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)' }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border/50 backdrop-blur-glass p-6 hover:border-neon-blue/50 transition-all duration-300 group cursor-pointer"
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background grid */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(45deg, #00d4ff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 border border-neon-blue/30 group-hover:border-neon-cyan/50 transition-colors duration-300">
            <Icon className="w-6 h-6 text-neon-cyan" />
          </div>
          <TrendingUp className="w-5 h-5 text-neon-green opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" />
        </div>
        
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent mb-2">
          {value}
        </p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
