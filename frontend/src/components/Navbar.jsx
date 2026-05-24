import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogOut, Globe, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDomain = localStorage.getItem('aciaSelectedDomainName') || 'ACIA';

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Competitors', path: '/competitors' },
    { name: 'Updates', path: '/updates' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Comparison', path: '/comparison' },
    { name: 'Reports', path: '/reports' },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-dark-bg via-dark-bg to-transparent border-b border-dark-border/50 backdrop-blur-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap className="w-8 h-8 text-neon-blue group-hover:text-neon-cyan transition-colors duration-300" />
              <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-lg group-hover:bg-neon-cyan/20 transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.5)] transition-all duration-300">
                ACIA
              </span>
              <span className="text-xs text-neon-cyan hidden sm:inline">{selectedDomain}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="relative group">
                <span className="text-sm font-medium text-slate-300 group-hover:text-neon-cyan transition-colors duration-300">
                  {item.name}
                </span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-cyan"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="absolute inset-0 bg-neon-blue/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangeDomain}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-neon-cyan border border-slate-700/50 hover:border-neon-cyan/50 transition-all duration-300 hover:bg-dark-card/50"
            >
              <Globe className="w-4 h-4" />
              Change Domain
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-red-400 border border-slate-700/50 hover:border-red-400/50 transition-all duration-300 hover:bg-dark-card/50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neon-blue hover:text-neon-cyan transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 text-neon-cyan border border-neon-blue/50'
                    : 'text-slate-300 hover:text-neon-cyan hover:bg-dark-card'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleChangeDomain}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-neon-cyan border border-slate-700/50 hover:border-neon-cyan/50 transition-all duration-300 hover:bg-dark-card/50"
            >
              <Globe className="w-4 h-4" />
              Change Domain
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-red-400 border border-slate-700/50 hover:border-red-400/50 transition-all duration-300 hover:bg-dark-card/50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
