import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Smartphone, Zap, Briefcase, ShoppingCart, CreditCard, ArrowRight } from 'lucide-react';

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
      gradient: 'from-purple-600/20 to-blue-600/20',
      borderColor: 'border-purple-500/30',
    },
    {
      key: 'mobile_phones',
      name: 'Mobile Phones',
      icon: Smartphone,
      description: 'Track smartphone launches, feature upgrades, camera improvements, AI phone features, pricing, and regional releases.',
      examples: 'Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo',
      status: 'Ready',
      gradient: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-500/30',
    },
    {
      key: 'electric_vehicles',
      name: 'Electric Vehicles',
      icon: Zap,
      description: 'Track EV launches, battery updates, charging networks, pricing changes, and market expansion.',
      examples: 'Tesla, BYD, Rivian, Hyundai, Tata EV',
      status: 'Ready',
      gradient: 'from-green-600/20 to-cyan-600/20',
      borderColor: 'border-green-500/30',
    },
    {
      key: 'saas',
      name: 'SaaS Products',
      icon: Briefcase,
      description: 'Track SaaS product launches, integrations, pricing changes, enterprise features, and product positioning.',
      examples: 'Notion, Slack, Linear, Atlassian, HubSpot',
      status: 'Ready',
      gradient: 'from-orange-600/20 to-red-600/20',
      borderColor: 'border-orange-500/30',
    },
    {
      key: 'ecommerce',
      name: 'E-commerce',
      icon: ShoppingCart,
      description: 'Track marketplace offers, seller tools, logistics updates, pricing, customer experience, and growth strategies.',
      examples: 'Amazon, Flipkart, Meesho, Myntra',
      status: 'Ready',
      gradient: 'from-pink-600/20 to-purple-600/20',
      borderColor: 'border-pink-500/30',
    },
    {
      key: 'fintech',
      name: 'FinTech',
      icon: CreditCard,
      description: 'Track payment products, lending updates, banking features, fintech regulations, and partnerships.',
      examples: 'Razorpay, Stripe, Paytm, PhonePe',
      status: 'Ready',
      gradient: 'from-yellow-600/20 to-orange-600/20',
      borderColor: 'border-yellow-500/30',
    },
  ];

  const handleDomainSelect = (domain) => {
    localStorage.setItem('aciaSelectedDomain', domain.key);
    localStorage.setItem('aciaSelectedDomainName', domain.name);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden pt-20 pb-12 px-4">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, delay: 2 }}
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Choose Intelligence Domain
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Select the market you want ACIA to monitor.</p>
        </motion.div>

        {/* Domain Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px rgba(${
                    domain.key === 'ai_genai' ? '168, 85, 247' :
                    domain.key === 'mobile_phones' ? '59, 130, 246' :
                    domain.key === 'electric_vehicles' ? '34, 197, 94' :
                    domain.key === 'saas' ? '249, 115, 22' :
                    domain.key === 'ecommerce' ? '236, 72, 153' :
                    '250, 204, 21'
                  }, 0.3)`,
                }}
                onClick={() => handleDomainSelect(domain)}
                className="cursor-pointer group"
              >
                <div
                  className={`backdrop-blur-xl bg-gradient-to-br ${domain.gradient} to-slate-900/50 border ${domain.borderColor} rounded-xl p-6 h-full transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className="mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-12 h-12 text-cyan-400 drop-shadow-lg" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {domain.name}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      {domain.description}
                    </p>

                    {/* Examples */}
                    <div className="mb-4">
                      <p className="text-slate-500 text-xs font-semibold mb-2">Key Players:</p>
                      <div className="flex flex-wrap gap-2">
                        {domain.examples.split(', ').map((example, i) => (
                          <span
                            key={i}
                            className="bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-slate-300 hover:bg-slate-700/50 transition-colors"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.div
                      className="flex items-center gap-2 text-cyan-400 font-semibold text-sm group-hover:text-cyan-300 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      Select Domain
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Border animation on hover */}
                  <motion.div
                    className="absolute inset-0 border rounded-xl pointer-events-none"
                    initial={{ borderColor: 'rgba(0, 212, 255, 0.1)' }}
                    whileHover={{ borderColor: 'rgba(0, 212, 255, 0.5)' }}
                    style={{ borderWidth: '1px' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="mt-12 backdrop-blur-xl bg-slate-900/30 border border-slate-700/50 rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <p className="text-slate-400 text-sm">
            💡 You can change your domain selection anytime from the dashboard. Each domain provides specialized competitive intelligence monitoring.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DomainSelection;
