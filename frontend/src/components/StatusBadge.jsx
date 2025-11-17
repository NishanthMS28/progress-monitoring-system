import React from 'react';

const statusConfig = {
  ahead: { label: 'Ahead', emoji: '🟢', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  'on-time': { label: 'On Time', emoji: '🟡', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  delayed: { label: 'Delayed', emoji: '🔴', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  unknown: { label: 'Unknown', emoji: '⚪', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
};

const StatusBadge = ({ status, size = 'md' }) => {
  const cfg = statusConfig[status] || statusConfig.unknown;
  const sz = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  return (
    <span className={`inline-flex items-center gap-1 ${sz} font-medium rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span>{cfg.emoji}</span>
      <span>{cfg.label}</span>
    </span>
  );
};

export default StatusBadge;

