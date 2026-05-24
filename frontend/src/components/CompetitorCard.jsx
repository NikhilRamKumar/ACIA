import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, BookOpen, Github } from 'lucide-react';

const CompetitorCard = ({ competitor, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)' }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border/50 backdrop-blur-glass p-6 hover:border-neon-blue/50 transition-all duration-300 group"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors duration-300">
            {competitor.name || 'Unknown Competitor'}
          </h3>
          <p className="text-sm text-neon-purple font-medium">
            {competitor.industry || 'N/A'}
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm line-clamp-3">
          {competitor.description || 'No description available'}
        </p>

        {/* Links Section */}
        <div className="space-y-2 pt-2">
          {/* Website */}
          {competitor.website && (
            <a
              href={competitor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neon-blue hover:text-neon-cyan transition-colors duration-300 text-sm group/link"
            >
              <Globe size={16} className="group-hover/link:scale-110 transition-transform" />
              <span className="truncate group-hover/link:underline">Website</span>
              <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          )}

          {/* Blog */}
          {competitor.blog_url && (
            <a
              href={competitor.blog_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neon-cyan hover:text-neon-blue transition-colors duration-300 text-sm group/link"
            >
              <BookOpen size={16} className="group-hover/link:scale-110 transition-transform" />
              <span className="truncate group-hover/link:underline">Blog</span>
              <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          )}

          {/* GitHub */}
          {competitor.github_url && (
            <a
              href={competitor.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neon-green hover:text-neon-cyan transition-colors duration-300 text-sm group/link"
            >
              <Github size={16} className="group-hover/link:scale-110 transition-transform" />
              <span className="truncate group-hover/link:underline">GitHub</span>
              <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          )}

          {/* Docs */}
          {competitor.docs_url && (
            <a
              href={competitor.docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neon-purple hover:text-neon-cyan transition-colors duration-300 text-sm group/link"
            >
              <BookOpen size={16} className="group-hover/link:scale-110 transition-transform" />
              <span className="truncate group-hover/link:underline">Documentation</span>
              <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          )}
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-xl border border-neon-blue/0 group-hover:border-neon-blue/50 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default CompetitorCard;
