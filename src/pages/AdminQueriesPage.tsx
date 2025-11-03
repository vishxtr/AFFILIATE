import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AdminLayout } from '../components/admin/AdminSidebar';
import { 
  Search, 
  Filter, 
  Clock, 
  Mail, 
  User, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Trash2,
  Eye,
  CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { logQueryStatusUpdated, logQueryDeleted } from '../lib/adminActivity';

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
  type: 'success' | 'error';
  message: string;
}

export default function AdminQueriesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (user) {
      fetchQueries();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    filterQueries();
  }, [queries, searchTerm, statusFilter]);

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  async function fetchQueries() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  }

  function filterQueries() {
    let filtered = queries;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.name.toLowerCase().includes(term) ||
        q.email.toLowerCase().includes(term) ||
        q.subject.toLowerCase().includes(term) ||
        q.message.toLowerCase().includes(term)
      );
    }

    setFilteredQueries(filtered);
  }

  async function updateQueryStatus(queryId: string, newStatus: string) {
    try {
      // Get old status before updating
      const query = queries.find(q => q.id === queryId);
      const oldStatus = query?.status || 'new';
      
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', queryId);

      if (error) throw error;

      // Log activity
      await logQueryStatusUpdated(queryId, oldStatus, newStatus);

      showNotification('success', 'Status updated successfully');
      fetchQueries();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update status');
    }
  }

  async function deleteQuery(queryId: string) {
    if (!confirm('Are you sure you want to delete this query?')) {
      return;
    }

    try {
      // Get query details before deleting
      const query = queries.find(q => q.id === queryId);
      
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', queryId);

      if (error) throw error;

      // Log activity
      if (query) {
        await logQueryDeleted(queryId, query.subject);
      }

      showNotification('success', 'Query deleted successfully');
      fetchQueries();
      setSelectedQuery(null);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to delete query');
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
    <AdminLayout title="Contact Queries">
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
          {/* Search and Filters */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, subject, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-slate-600">
              Showing {filteredQueries.length} of {queries.length} queries
            </div>
          </motion.div>

          {/* Queries List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQueries.length === 0 ? (
              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <p className="text-slate-600">No queries found</p>
              </div>
            ) : (
              filteredQueries.map((query, index) => (
                <motion.div
                  key={query.id}
                  className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer ${
                    selectedQuery?.id === query.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedQuery(query)}
                >
                  <div className="flex items-start justify-between mb-4">
                    {getStatusBadge(query.status)}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-4 h-4" />
                      {new Date(query.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">{query.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{query.email}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 mb-2">{query.subject}</p>
                      <p className="text-sm text-slate-600 line-clamp-3">{query.message}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQueryStatus(query.id, 'in_progress');
                      }}
                      className="flex-1 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg transition-colors"
                      disabled={query.status === 'in_progress'}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQueryStatus(query.id, 'resolved');
                      }}
                      className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-lg transition-colors"
                      disabled={query.status === 'resolved'}
                    >
                      Resolved
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuery(query.id);
                      }}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
