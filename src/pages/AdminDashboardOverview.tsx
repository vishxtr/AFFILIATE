import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminSidebar';
import AdminStats from '@/components/admin/AdminStats';
import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Query {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function AdminDashboardOverview() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQueries: 0,
    activeUsers: 1243,
    totalViews: 15420
  });
  
  const [recentQueries, setRecentQueries] = useState<Query[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  function showNotification(type: 'success' | 'error' | 'info', message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) throw productsError;

      // Fetch queries count and recent queries
      const { data: queriesData, count: queriesCount, error: queriesError } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      if (queriesError) throw queriesError;

      setStats({
        totalProducts: productsCount || 0,
        totalQueries: queriesCount || 0,
        activeUsers: 1243, // Mock data
        totalViews: 15420  // Mock data
      });

      setRecentQueries(queriesData || []);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      resolved: 'bg-green-100 text-green-700 border-green-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.new}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top">
          <div className={`rounded-lg shadow-lg p-4 flex items-start gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : notification.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm flex-1 ${
              notification.type === 'success' ? 'text-green-800' : 
              notification.type === 'error' ? 'text-red-800' : 'text-blue-800'
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
          {/* Stats Cards */}
          <AdminStats stats={stats} />

          {/* Recent Queries */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Contact Queries</h2>
                <p className="text-sm text-slate-600 mt-1">Latest customer inquiries</p>
              </div>
              <button
                onClick={() => navigate('/admin/queries')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View All
              </button>
            </div>

            {recentQueries.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-600">No contact queries yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentQueries.map((query) => (
                  <div key={query.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{query.name}</h3>
                          {getStatusBadge(query.status)}
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{query.email}</p>
                        <p className="text-sm font-medium text-slate-800 mb-2">Subject: {query.subject}</p>
                        <p className="text-sm text-slate-600 line-clamp-2">{query.message}</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                          <Clock className="w-4 h-4" />
                          {new Date(query.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate('/admin/products')}
              className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Products</h3>
              <p className="text-sm text-slate-600">Add, edit, or remove products from your catalog</p>
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Site Settings</h3>
              <p className="text-sm text-slate-600">Configure website settings and preferences</p>
            </button>

            <button
              onClick={() => navigate('/admin/analytics')}
              className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">View Analytics</h3>
              <p className="text-sm text-slate-600">Track performance and user engagement</p>
            </button>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
