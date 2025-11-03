import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from '../components/admin/AdminSidebar';
import { getActivityLogs, getActivityStats } from '../lib/adminActivity';
import { Search, Filter, Calendar, User, Activity, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: any;
  created_at: string;
  user_agent: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

export default function AdminActivityLogsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [stats, setStats] = useState({
    totalActions: 0,
    createActions: 0,
    updateActions: 0,
    deleteActions: 0,
    loginActions: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (user) {
      fetchActivityLogs();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter]);

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  async function fetchActivityLogs() {
    try {
      setLoading(true);
      const [logsData, statsData] = await Promise.all([
        getActivityLogs(100),
        getActivityStats()
      ]);

      setLogs(logsData);
      if (statsData) {
        setStats(statsData);
      }
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  }

  function filterLogs() {
    let filtered = logs;

    // Filter by action
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.admin_email.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        (log.entity_type && log.entity_type.toLowerCase().includes(term)) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(term))
      );
    }

    setFilteredLogs(filtered);
  }

  function getActionIcon(action: string) {
    switch (action) {
      case 'create':
        return <span className="text-green-600">➕</span>;
      case 'update':
        return <span className="text-blue-600">✏️</span>;
      case 'delete':
        return <span className="text-red-600">🗑️</span>;
      case 'login':
        return <span className="text-purple-600">🔐</span>;
      case 'logout':
        return <span className="text-gray-600">👋</span>;
      default:
        return <span className="text-gray-600">📝</span>;
    }
  }

  function getActionColor(action: string) {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'login':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'logout':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Activity Logs">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top">
          <div className={`rounded-lg shadow-lg p-4 flex items-start gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm flex-1 ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </p>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <motion.div
              className="bg-white rounded-lg border border-slate-200 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Total Actions</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalActions}</p>
                </div>
                <Activity className="w-8 h-8 text-slate-400" />
              </div>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-lg border border-green-200 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-700">Created</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{stats.createActions}</p>
                </div>
                <span className="text-2xl">➕</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-blue-50 rounded-lg border border-blue-200 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700">Updated</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{stats.updateActions}</p>
                </div>
                <span className="text-2xl">✏️</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-red-50 rounded-lg border border-red-200 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-700">Deleted</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{stats.deleteActions}</p>
                </div>
                <span className="text-2xl">🗑️</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-purple-50 rounded-lg border border-purple-200 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-700">Logins</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{stats.loginActions}</p>
                </div>
                <span className="text-2xl">🔐</span>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by admin, action, entity, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              Showing {filteredLogs.length} of {logs.length} activities
            </div>
          </motion.div>

          {/* Activity Logs List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No activity logs found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    className="p-6 hover:bg-slate-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-2xl">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                            {log.action.toUpperCase()}
                          </span>
                          {log.entity_type && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {log.entity_type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{log.admin_email}</span>
                        </div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-sm text-slate-600 mb-2">
                            <strong>Details:</strong>
                            <pre className="mt-1 text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
