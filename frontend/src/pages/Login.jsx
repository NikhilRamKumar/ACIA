import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl"
          whileHover={{ boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)' }}
        >
          {/* Logo Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                ACIA
              </h1>
            </div>
            <p className="text-slate-300 text-sm">Autonomous Competitive Intelligence Agent</p>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-slate-400 text-center text-sm mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Monitor competitors, detect strategic signals, predict next moves, and make smarter business decisions.
          </motion.p>

          {/* Form */}
          <motion.form
            onSubmit={handleLogin}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400/50" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400/50" />
              <input
                type="password"
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 mt-6"
            >
              Login to ACIA
            </motion.button>
          </motion.form>

          {/* Demo Info */}
          <motion.div
            className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-blue-300 text-xs text-center">
              💡 Demo mode: enter any email and password to continue.
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-slate-500 text-xs mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Demo authentication • No data is stored
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
