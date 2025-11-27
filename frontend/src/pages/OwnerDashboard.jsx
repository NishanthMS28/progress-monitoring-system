import React, { useEffect, useState } from 'react';
import { progressAPI } from '../services/api';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, BarChart3, X } from 'lucide-react';
import ChartComponent from '../components/ChartComponent';
import StatusBadge from '../components/StatusBadge';

const OwnerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [overlayData, setOverlayData] = useState({ stats: null, chart: null, history: [] });
  const [viewingImage, setViewingImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);

  useEffect(() => {
    loadOverview();
    const interval = setInterval(loadOverview, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadOverview = async () => {
    try {
      const response = await progressAPI.getOverview();
      setOverview(response.data);
    } catch (error) {
      console.error('Error loading overview:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOverview();
  };

  const openProjectOverlay = async (projectId) => {
    setSelectedProject(projectId);
    setOverlayLoading(true);
    try {
      const [statsRes, chartRes, historyRes] = await Promise.all([
        progressAPI.getStats(projectId),
        progressAPI.getChartData(projectId, { days: 7 }),
        progressAPI.getHistory(projectId, { limit: 10 })
      ]);
      setOverlayData({ stats: statsRes.data, chart: chartRes.data, history: historyRes.data.data });
    } catch (e) {
      console.error('Overlay load error', e);
    } finally {
      setOverlayLoading(false);
    }
  };

  const closeOverlay = () => {
    setSelectedProject(null);
    setOverlayData({ stats: null, chart: null, history: [] });
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
              <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Complete overview of all manufacturing projects</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <DashboardCard title="Total Projects" value={overview?.summary?.totalProjects || 0} subtitle="Active projects" icon={<BarChart3 className="w-6 h-6" />} color="blue" />
          <DashboardCard title="On Track" value={overview?.summary?.onTrack || 0} subtitle="Projects ahead/on-time" icon={<CheckCircle className="w-6 h-6" />} color="green" />
          <DashboardCard title="Delayed" value={overview?.summary?.delayed || 0} subtitle="Projects behind schedule" icon={<AlertTriangle className="w-6 h-6" />} color="red" />
          <DashboardCard title="Avg Completion" value={`${overview?.summary?.averageCompletion || 0}%`} subtitle="Across all projects" icon={<TrendingUp className="w-6 h-6" />} color="purple" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">All Projects</h2>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Project</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Progress</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Completion</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Deviation</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Last Update</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email Alerts</th>
                </tr>
              </thead>
              <tbody>
                {overview?.projects?.map((project, index) => (
                  <motion.tr key={project.projectId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-6 cursor-pointer" onClick={() => openProjectOverlay(project.projectId)}>
                      <div className="font-semibold text-gray-800">{project.projectName}</div>
                      <div className="text-sm text-gray-500">{project.totalUnits} units total</div>
                    </td>
                    <td className="py-4 px-6 cursor-pointer" onClick={() => openProjectOverlay(project.projectId)}>
                      <div className="text-gray-800">{project.customerName}</div>
                      <div className="text-sm text-gray-500">{project.customerEmail}</div>
                    </td>
                    <td className="py-4 px-6 cursor-pointer" onClick={() => openProjectOverlay(project.projectId)}>
                      <div className="font-semibold text-gray-800">{project.currentProgress} / {project.expectedProgress}</div>
                    </td>
                    <td className="py-4 px-6 cursor-pointer" onClick={() => openProjectOverlay(project.projectId)}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(project.completionPercentage, 100)}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{project.completionPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 cursor-pointer" onClick={() => openProjectOverlay(project.projectId)}><StatusBadge status={project.status} size="sm" /></td>
                    <td className="py-4 px-6 cursor-pointer" onClick={() => openProjectOverlay(project.projectId)}><span className={`font-semibold ${project.deviation >= 0 ? 'text-green-600' : 'text-red-600'}`}>{project.deviation >= 0 ? '+' : ''}{project.deviation}</span></td>
                    <td className="py-4 px-6 text-sm text-gray-600 cursor-pointer" onClick={() => openProjectOverlay(project.projectId)}>{project.lastUpdate ? new Date(project.lastUpdate).toLocaleString() : 'N/A'}</td>
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={async () => {
                          try {
                            const newValue = !project.ownerEmailNotifications;

                            // Optimistically update UI
                            setOverview(prev => ({
                              ...prev,
                              projects: prev.projects.map(p =>
                                p.projectId === project.projectId
                                  ? { ...p, ownerEmailNotifications: newValue }
                                  : p
                              )
                            }));

                            const token = localStorage.getItem('token');
                            const res = await fetch(`/api/projects/${project.projectId}/preferences`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ ownerEmailNotifications: newValue })
                            });

                            if (!res.ok) {
                              // Revert on error
                              loadOverview();
                            }
                          } catch (err) {
                            console.error('Failed to toggle project notifications', err);
                            // Revert on error
                            loadOverview();
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${project.ownerEmailNotifications !== false ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${project.ownerEmailNotifications !== false ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {(!overview?.projects || overview.projects.length === 0) && (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-500">No projects found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeOverlay}>
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-6xl h-[80%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Customer Portal</h3>
              <button onClick={closeOverlay} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              {overlayLoading && (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
                </div>
              )}
              {!overlayLoading && overlayData.stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <DashboardCard title="Current Progress" value={overlayData.stats.currentProgress} subtitle={`of ${overlayData.stats.project.totalUnits} units`} icon={<TrendingUp className="w-6 h-6" />} color="blue" />
                    <DashboardCard title="Completion" value={`${overlayData.stats.completionPercentage}%`} subtitle="Total completion" icon={<CheckCircle className="w-6 h-6" />} color="green" />
                    <DashboardCard title="Status" value={<StatusBadge status={overlayData.stats.currentStatus} />} subtitle={`Deviation: ${Math.round(overlayData.stats.averageDeviation || 0)}`} icon={<AlertTriangle className="w-6 h-6" />} color="purple" />
                    <DashboardCard title="Project" value={overlayData.stats.project.name} subtitle={overlayData.stats.project._id} icon={<BarChart3 className="w-6 h-6" />} color="orange" />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Progress Trend (Last 7 Days)</h4>
                    <ChartComponent data={overlayData.chart} />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Recent History</h4>
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
                          {overlayData.history.map((entry, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
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
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image View Modal - Copied from CustomerDashboard */}
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

export default OwnerDashboard;

