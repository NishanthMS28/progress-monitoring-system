import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import ChartComponent from '../components/ChartComponent';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Image as ImageIcon, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [latestProgress, setLatestProgress] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user?.projectId) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.projectId?._id && !user?.projectId) return;
    const projectId = typeof user.projectId === 'object' ? user.projectId._id : user.projectId;
    try {
      const [statsRes, latestRes, chartRes, historyRes] = await Promise.all([
        progressAPI.getStats(projectId),
        progressAPI.getLatest(projectId),
        progressAPI.getChartData(projectId, { days: 7 }),
        progressAPI.getHistory(projectId, { limit: 10 })
      ]);
      setStats(statsRes.data);
      setLatestProgress(latestRes.data);
      setChartData(chartRes.data);
      setHistory(historyRes.data.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
              <p className="text-gray-600 mt-1">{stats?.project?.name || 'Your Project'}</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Current Progress" value={stats?.currentProgress || 0} subtitle={`of ${stats?.project?.totalUnits || 0} units`} icon={<TrendingUp className="w-6 h-6" />} color="blue" />
          <DashboardCard title="Completion" value={`${stats?.completionPercentage || 0}%`} subtitle="Total completion" icon={<CheckCircle className="w-6 h-6" />} color="green" />
          <DashboardCard title="Status" value={<StatusBadge status={stats?.currentStatus} />} subtitle={`Deviation: ${stats?.averageDeviation >= 0 ? '+' : ''}${Math.round(stats?.averageDeviation || 0)}`} icon={<AlertCircle className="w-6 h-6" />} color="purple" />
          <DashboardCard title="Last Update" value={latestProgress ? new Date(latestProgress.timestamp).toLocaleTimeString() : 'N/A'} subtitle={latestProgress ? new Date(latestProgress.timestamp).toLocaleDateString() : ''} icon={<Clock className="w-6 h-6" />} color="orange" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Progress</h2>
          <ProgressBar current={stats?.currentProgress || 0} total={stats?.project?.totalUnits || 100} status={stats?.currentStatus} />
        </motion.div>
        {latestProgress?.imagePath && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Latest Progress Image</h2>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={`http://localhost:5000/uploads/${latestProgress.imagePath}`}
                alt="Latest Progress"
                className="w-full h-auto"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available'; }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm">Captured: {new Date(latestProgress.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Progress Trend (Last 7 Days)</h2>
          {chartData && <ChartComponent data={chartData} />}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Recent History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Expected</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Deviation</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">View</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-sm text-gray-700">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-800">{entry.progressCount}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{entry.expectedCount}</td>
                    <td className="py-3 px-4"><StatusBadge status={entry.status} size="sm" /></td>
                    <td className="py-3 px-4 text-sm">
                      <span className={entry.deviation >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {entry.deviation >= 0 ? '+' : ''}{entry.deviation}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {entry.imagePath ? (
                        <button
                          title="View image"
                          onClick={() => {
                            const imageUrl = `http://localhost:5000/uploads/${entry.imagePath}`;
                            console.log('Opening image:', imageUrl);
                            setImageError(false);
                            setViewingImage(imageUrl);
                          }}
                          className="text-purple-600 hover:text-purple-800 transition cursor-pointer text-lg"
                        >
                          👁️
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Image View Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4"
          onClick={() => {
            setViewingImage(null);
            setImageError(false);
          }}
        >
          <div 
            className="relative max-w-5xl max-h-[95vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setViewingImage(null);
                setImageError(false);
              }}
              className="absolute top-4 right-4 z-10 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-red-600 transition text-xl font-bold shadow-lg"
            >
              ✕
            </button>
            {imageError ? (
              <div className="p-20 text-center">
                <p className="text-white text-xl mb-4">Image not available</p>
                <p className="text-gray-400 text-sm mb-4">URL: {viewingImage}</p>
                <button
                  onClick={() => {
                    setViewingImage(null);
                    setImageError(false);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={viewingImage}
                  alt="Progress Image"
                  className="max-w-full max-h-[90vh] object-contain rounded"
                  onLoad={() => {
                    console.log('Image loaded successfully:', viewingImage);
                    setImageError(false);
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', viewingImage);
                    setImageError(true);
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
                  {viewingImage}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

