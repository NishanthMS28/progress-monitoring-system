import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartComponent = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No chart data available</div>;
  }
  const chartData = {
    labels: data.labels.map(l => new Date(l).toLocaleDateString()),
    datasets: [
      { label: 'Actual Progress', data: data.actual, borderColor: 'rgb(99, 102, 241)', backgroundColor: 'rgba(99, 102, 241, 0.1)', fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 6 },
      { label: 'Expected Progress', data: data.expected, borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.1)', fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 6, borderDash: [5, 5] }
    ]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };
  return <div className="h-80"><Line data={chartData} options={options} /></div>;
};

export default ChartComponent;

