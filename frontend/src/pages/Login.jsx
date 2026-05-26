import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, TrendingUp, Brain, AlertCircle, Zap as ZapIcon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // Save to localStorage (demo mode)
    localStorage.setItem('aciaLoggedIn', 'true');
    localStorage.setItem('aciaUserEmail', email);

    // Redirect to domain selection
    navigate('/domains');
  };

  const features = [
    {
      icon: Brain,
      title: 'Multi-domain Intelligence',
      description: 'Monitor competitors across AI, Mobile, EV, SaaS, E-commerce, FinTech',
    },
    {
      icon: TrendingUp,
      title: 'AI-Powered Summaries',
      description: 'Automatically analyze updates and extract key intelligence signals',
    },
    {
      icon: AlertCircle,
      title: 'Threat Scoring',
      description: 'Real-time threat assessment of competitor moves with predictive insights',
    },
    {
      icon: ZapIcon,
      title: 'Market Trend Reports',
      description: 'Comprehensive competitive intelligence and strategic recommendations',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f172a] to-black relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 -left-1/4 w-96 h-96 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 -right-1/4 w-96 h-96 bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Branding */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              {/* Logo */}
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 border border-neon-blue/30">
                    <Zap className="w-8 h-8 text-neon-cyan" />
                  </div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
                    ACIA
                  </h1>
                </div>
                <p className="text-neon-cyan text-sm font-semibold">Autonomous Competitive Intelligence Agent</p>
              </motion.div>

              {/* Main Description */}
              <motion.div variants={itemVariants} className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                  Enterprise-Grade{' '}
                  <span className="bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                    Market Intelligence
                  </span>
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  Monitor competitors, detect market signals, predict strategic moves, and generate intelligence reports across multiple domains.
                </p>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ x: 10 }}
                      className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-dark-card/50 to-dark-bg/50 border border-dark-border/30 hover:border-neon-blue/30 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 group-hover:from-neon-blue/40 group-hover:to-neon-cyan/40 transition-all">
                        <Icon className="w-5 h-5 text-neon-cyan group-hover:text-neon-blue transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-xs text-slate-400">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Side - Login Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-dark-card/60 to-dark-bg/60 backdrop-blur-xl border border-neon-blue/20 shadow-2xl overflow-hidden">
                {/* Card Header */}
                <div className="px-8 pt-8 pb-6 border-b border-dark-border/30">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-slate-400 text-sm">Enter your credentials to access ACIA</p>
                </div>

                {/* Card Content */}
                <div className="px-8 py-8">
                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Input */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-slate-300">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/40 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-dark-card/50 border border-dark-border/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                        />
                      </div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-slate-300">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/40 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-dark-card/50 border border-dark-border/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                        />
                      </div>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-threat-high/10 border border-threat-high/30 rounded-lg p-4 flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-threat-high flex-shrink-0 mt-0.5" />
                        <p className="text-threat-high text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Login Button */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="w-full relative group mt-6 overflow-hidden rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold py-3 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        Login to ACIA
                      </span>
                    </motion.button>
                  </form>

                  {/* Demo Note */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-lg text-center"
                  >
                    <p className="text-neon-cyan text-xs font-medium">
                      Demo Mode: Enter any email and password to continue
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Footer Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-slate-500 text-xs mt-6"
              >
                No backend login required • Demo authentication
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
