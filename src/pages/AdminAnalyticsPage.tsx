import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminSidebar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Package, MessageSquare, Users, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Notification {
  type: 'success' | 'error';
  message: string;
}

export default function AdminAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Sample data for charts (in production, this would come from real analytics)
  const productCategoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Fashion', value: 30 },
    { name: 'Home & Kitchen', value: 15 },
    { name: 'Sports', value: 10 }
  ];

  const queriesTrendData = [
    { month: 'Jan', queries: 12 },
    { month: 'Feb', queries: 19 },
    { month: 'Mar', queries: 15 },
    { month: 'Apr', queries: 25 },
    { month: 'May', queries: 22 },
    { month: 'Jun', queries: 30 }
  ];

  const productPerformanceData = [
    { category: 'Electronics', views: 1200, conversions: 85 },
    { category: 'Fashion', views: 980, conversions: 67 },
    { category: 'Home', views: 750, conversions: 52 },
    { category: 'Sports', views: 520, conversions: 38 }
  ];

  const statusDistributionData = [
    { name: 'New', value: 35 },
    { name: 'In Progress', value: 40 },
    { name: 'Resolved', value: 25 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  const STATUS_COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQueries: 0,
    newQueries: 0,
    resolvedQueries: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (user) {
      fetchAnalyticsData();
    }
  }, [user, authLoading, navigate]);

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  async function fetchAnalyticsData() {
    try {
      setLoading(true);

      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch queries stats
      const { data: queriesData, count: totalQueries } = await supabase
        .from('contact_submissions')
        .select('status', { count: 'exact' });

      const newQueries = queriesData?.filter(q => q.status === 'new').length || 0;
      const resolvedQueries = queriesData?.filter(q => q.status === 'resolved').length || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalQueries: totalQueries || 0,
        newQueries,
        resolvedQueries
      });
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
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
    <AdminLayout title="Analytics & Reports">
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalProducts}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Queries</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalQueries}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">New Queries</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.newQueries}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-full">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Resolved Queries</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.resolvedQueries}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Query Trends */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Query Trends (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={queriesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="queries" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Contact Queries"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Product Categories Distribution */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Product Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Product Performance */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Product Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="views" fill="#3b82f6" name="Views" />
                  <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Query Status Distribution */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Query Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
