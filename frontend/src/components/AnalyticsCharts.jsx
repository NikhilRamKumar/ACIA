import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from 'recharts';

const CATEGORY_COLORS = ['#00d4ff', '#00f0ff', '#b300ff', '#8b5cf6', '#39ff14', '#fbbf24', '#ef4444'];
const THREAT_COLORS = ['#10b981', '#f59e0b', '#ef4444']; // green, yellow, red

const AnalyticsCharts = ({ updates }) => {
  // Prepare category distribution data
  const prepareCategoryData = () => {
    if (!updates || updates.length === 0) return [];

    const categoryCount = {};
    updates.forEach(update => {
      const category = update.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Prepare threat level distribution data
  const prepareThreatData = () => {
    if (!updates || updates.length === 0) return [];

    let low = 0; // 1-3
    let medium = 0; // 4-6
    let high = 0; // 7-10

    updates.forEach(update => {
      const score = update.threat_score || 0;
      if (score <= 3) {
        low += 1;
      } else if (score <= 6) {
        medium += 1;
      } else {
        high += 1;
      }
    });

    return [
      { name: 'Low', value: low, threat: 'low' },
      { name: 'Medium', value: medium, threat: 'medium' },
      { name: 'High', value: high, threat: 'high' },
    ];
  };

  // Prepare competitor-wise update count
  const prepareCompetitorData = () => {
    if (!updates || updates.length === 0) return null;

    // Check if competitor data exists in first update
    if (!updates[0].competitor || typeof updates[0].competitor === 'number') {
      return null; // No competitor object data, skip this chart
    }

    const competitorCount = {};
    updates.forEach(update => {
      if (update.competitor && update.competitor.name) {
        const name = update.competitor.name;
        competitorCount[name] = (competitorCount[name] || 0) + 1;
      }
    });

    if (Object.keys(competitorCount).length === 0) return null;

    return Object.entries(competitorCount)
      .map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        updates: count,
      }))
      .sort((a, b) => b.updates - a.updates)
      .slice(0, 10); // Top 10 competitors
  };

  const categoryData = prepareCategoryData();
  const threatData = prepareThreatData();
  const competitorData = prepareCompetitorData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-neon-blue/30 rounded px-3 py-2 shadow-lg">
          <p className="text-white text-sm font-semibold">{payload[0].payload.name}</p>
          <p className="text-neon-cyan text-sm">{payload[0].value} updates</p>
        </div>
      );
    }
    return null;
  };

  if (!updates || updates.length === 0) {
    return null; // Don't show charts if no data
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
      </div>

      {/* Charts Grid */}
      <div className={`grid grid-cols-1 ${competitorData ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="bg-gradient-to-br from-dark-card to-dark-bg border border-neon-blue/20 backdrop-blur-glass rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-neon-blue"></span>
            Update Categories
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                  ></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-neon-cyan font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Threat Level Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gradient-to-br from-dark-card to-dark-bg border border-neon-purple/20 backdrop-blur-glass rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-neon-purple"></span>
            Threat Levels
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={threatData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {threatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={THREAT_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {threatData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: THREAT_COLORS[index] }}
                  ></div>
                  <span className="text-slate-300 capitalize">{item.name} Threat</span>
                </div>
                <span className="text-neon-cyan font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Competitor Updates Count (Optional) */}
        {competitorData && competitorData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="bg-gradient-to-br from-dark-card to-dark-bg border border-neon-green/20 backdrop-blur-glass rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-neon-green"></span>
              Top Competitors
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={competitorData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#2a3f5f' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#2a3f5f' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="updates" fill="#39ff14" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AnalyticsCharts;
