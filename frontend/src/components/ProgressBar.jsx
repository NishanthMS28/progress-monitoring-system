import React from 'react';

const ProgressBar = ({ current, total, status }) => {
  const percentage = Math.min(total > 0 ? (current / total) * 100 : 0, 100);
  const colors = { ahead: 'bg-green-500', 'on-time': 'bg-yellow-500', delayed: 'bg-red-500', unknown: 'bg-gray-500' };
  const barColor = colors[status] || colors.unknown;
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{current} / {total} units</span>
        <span className="text-sm font-bold text-gray-900">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div className={`${barColor} h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`} style={{ width: `${percentage}%` }}>
          {percentage > 10 && <span className="text-xs font-bold text-white">{percentage.toFixed(0)}%</span>}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

