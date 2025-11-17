import React from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  blue: 'from-blue-500 to-indigo-600',
  green: 'from-green-500 to-emerald-600',
  purple: 'from-purple-500 to-indigo-600',
  red: 'from-red-500 to-rose-600',
  orange: 'from-orange-500 to-amber-600'
};

const DashboardCard = ({ title, value, subtitle, icon, color = 'purple' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[color] || colorMap.purple} text-white`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;

