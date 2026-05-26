import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Smartphone, Zap, Briefcase, ShoppingCart, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';

const DomainSelection = () => {
  const navigate = useNavigate();

  const domains = [
    {
      key: 'ai_genai',
      name: 'AI / GenAI',
      icon: Brain,
      description: 'Track LLM companies, AI labs, model releases, RAG platforms, pricing updates, and developer tools.',
      examples: 'OpenAI, Anthropic, Perplexity, Mistral, Cohere',
      status: 'Active',
      accentColor: 'from-neon-purple to-neon-blue',
      badgeColor: 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple',
    },
    {
      key: 'mobile_phones',
      name: 'Mobile Phones',
      icon: Smartphone,
      description: 'Track smartphone launches, feature upgrades, camera improvements, AI phone features, pricing, and regional releases.',
      examples: 'Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo',
      status: 'Active',
      accentColor: 'from-blue-500/30 to-neon-cyan/30',
      badgeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    },
    {
      key: 'electric_vehicles',
      name: 'Electric Vehicles',
      icon: Zap,
      description: 'Track EV launches, battery updates, charging networks, pricing changes, and market expansion.',
      examples: 'Tesla, BYD, Rivian, Hyundai, Tata EV',
      status: 'Active',
      accentColor: 'from-neon-green/30 to-neon-cyan/30',
      badgeColor: 'bg-neon-green/20 border-neon-green/50 text-neon-green',
    },
    {
      key: 'saas',
      name: 'SaaS Products',
      icon: Briefcase,
      description: 'Track SaaS product launches, integrations, pricing changes, enterprise features, and product positioning.',
      examples: 'Notion, Slack, Linear, Atlassian, HubSpot',
      status: 'Active',
      accentColor: 'from-orange-500/30 to-red-500/30',
      badgeColor: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
    },
    {
      key: 'ecommerce',
      name: 'E-commerce',
      icon: ShoppingCart,
      description: 'Track marketplace offers, seller tools, logistics updates, pricing, customer experience, and growth strategies.',
      examples: 'Amazon, Flipkart, Meesho, Myntra',
      status: 'Active',
      accentColor: 'from-pink-500/30 to-neon-purple/30',
      badgeColor: 'bg-pink-500/20 border-pink-500/50 text-pink-300',
    },
    {
      key: 'fintech',
      name: 'FinTech',
      icon: CreditCard,
      description: 'Track payment products, lending updates, banking features, fintech regulations, and partnerships.',
      examples: 'Razorpay, Stripe, Paytm, PhonePe',
      status: 'Active',
      accentColor: 'from-yellow-500/30 to-orange-500/30',
      badgeColor: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    },
  ];

  const handleDomainSelect = (domain) => {
    localStorage.setItem('aciaSelectedDomain', domain.key);
    localStorage.setItem('aciaSelectedDomainName', domain.name);
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-[#0f172a] to-black relative overflow-hidden pt-20 pb-16 px-4">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 -left-1/4 w-96 h-96 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 -right-1/4 w-96 h-96 bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 border border-neon-cyan/30">
              <p className="text-neon-cyan text-xs font-semibold">Domain Selection</p>
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Choose Your Intelligence Domain
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Select the market ACIA should monitor and analyze. Each domain provides specialized competitive intelligence and strategic insights.
          </p>
        </motion.div>

        {/* Domain Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.key}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onClick={() => handleDomainSelect(domain)}
                className="cursor-pointer group h-full"
              >
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-dark-card/60 to-dark-bg/60 border border-dark-border/30 hover:border-neon-blue/40 transition-all duration-300 h-full p-6 flex flex-col">
                  {/* Animated gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${domain.accentColor}`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />

                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(45deg, #00d4ff 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className="p-3 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 border border-neon-blue/30 group-hover:border-neon-cyan/50 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-6 h-6 text-neon-cyan" />
                      </motion.div>
                      <motion.div
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${domain.badgeColor}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {domain.status}
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                      {domain.name}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-5 leading-relaxed flex-grow">
                      {domain.description}
                    </p>

                    {/* Examples */}
                    <div className="mb-6 pb-6 border-b border-dark-border/20">
                      <p className="text-slate-500 text-xs font-semibold mb-3">Featured Competitors:</p>
                      <div className="flex flex-wrap gap-2">
                        {domain.examples.split(', ').slice(0, 3).map((example, i) => (
                          <motion.span
                            key={i}
                            className="bg-dark-card/50 border border-dark-border/50 rounded-full px-3 py-1 text-xs text-slate-300 hover:bg-dark-card hover:border-neon-cyan/30 transition-all"
                            whileHover={{ scale: 1.05 }}
                          >
                            {example}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.div
                      className="flex items-center gap-2 text-neon-cyan font-semibold text-sm group-hover:text-neon-blue transition-colors mt-auto"
                      whileHover={{ x: 5 }}
                    >
                      Enter Domain
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>

                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-2xl border border-neon-blue/0 group-hover:border-neon-cyan/50 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="mt-12 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-dark-card/50 to-dark-bg/50 border border-neon-blue/20 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ borderColor: 'rgba(0, 240, 255, 0.4)' }}
        >
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
            <span className="text-neon-cyan font-semibold">💡 Pro Tip:</span> You can change your domain selection anytime from the dashboard's navigation menu. Each domain provides specialized competitive intelligence, threat analysis, and market trend reports.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DomainSelection;
