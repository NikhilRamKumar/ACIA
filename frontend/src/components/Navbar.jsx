import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogOut, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDomain = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Competitors', path: '/competitors', icon: '🏢' },
    { name: 'Updates', path: '/updates', icon: '📰' },
    { name: 'Alerts', path: '/alerts', icon: '🚨' },
    { name: 'Comparison', path: '/comparison', icon: '⚖️' },
    { name: 'Reports', path: '/reports', icon: '📈' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('aciaLoggedIn');
    localStorage.removeItem('aciaUserEmail');
    localStorage.removeItem('aciaSelectedDomain');
    localStorage.removeItem('aciaSelectedDomainName');
    navigate('/login');
  };

  const handleChangeDomain = () => {
    navigate('/domains');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-dark-bg via-dark-bg/95 to-transparent border-b border-neon-blue/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Domain */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 border border-neon-blue/30 group-hover:border-neon-cyan/50 transition-all"
              whileHover={{ scale: 1.1 }}
            >
              <Zap className="w-5 h-5 text-neon-cyan" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent">
                ACIA
              </span>
              <span className="text-xs text-neon-cyan/70 font-semibold">{selectedDomain}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.div key={item.path} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className="relative group px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive(item.path)
                        ? 'text-neon-cyan'
                        : 'text-slate-300 group-hover:text-neon-cyan'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-cyan/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Domain Badge */}
            <motion.div
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-card/50 border border-neon-blue/20"
              whileHover={{ borderColor: 'rgba(0, 240, 255, 0.5)' }}
            >
              <Globe className="w-4 h-4 text-neon-cyan" />
              <span className="text-xs font-semibold text-slate-300">{selectedDomain}</span>
            </motion.div>

            {/* Change Domain Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangeDomain}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-neon-cyan border border-dark-border/50 hover:border-neon-cyan/50 hover:bg-dark-card/50 transition-all duration-300"
            >
              Switch Domain
            </motion.button>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-threat-high border border-dark-border/50 hover:border-threat-high/50 hover:bg-threat-high/5 transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg text-neon-cyan hover:bg-dark-card transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pb-4 space-y-2 border-t border-dark-border/20 pt-4"
            >
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 text-neon-cyan border border-neon-blue/50'
                        : 'text-slate-300 hover:text-neon-cyan hover:bg-dark-card/50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 space-y-2 border-t border-dark-border/20 mt-2"
              >
                <div className="px-4 py-2 rounded-lg bg-dark-card/50 border border-neon-blue/20">
                  <p className="text-xs text-slate-400 mb-1">Current Domain</p>
                  <p className="text-sm font-semibold text-neon-cyan">{selectedDomain}</p>
                </div>

                <button
                  onClick={handleChangeDomain}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-neon-cyan border border-dark-border/50 hover:border-neon-cyan/50 hover:bg-dark-card/50 transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  Switch Domain
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-threat-high border border-dark-border/50 hover:border-threat-high/50 hover:bg-threat-high/5 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
