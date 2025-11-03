import { Package, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

function StatCard({ icon: Icon, label, value, change, changeType }: StatCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="bg-blue-100 p-4 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </motion.div>
  );
}

interface AdminStatsProps {
  stats: {
    totalProducts: number;
    totalQueries: number;
    activeUsers: number;
    totalViews: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Package}
        label="Total Products"
        value={stats.totalProducts}
        change="+12% from last month"
        changeType="increase"
      />
      <StatCard
        icon={MessageSquare}
        label="Contact Queries"
        value={stats.totalQueries}
        change="+8% from last month"
        changeType="increase"
      />
      <StatCard
        icon={Users}
        label="Active Visitors"
        value={stats.activeUsers}
        change="+23% from last month"
        changeType="increase"
      />
      <StatCard
        icon={TrendingUp}
        label="Product Views"
        value={stats.totalViews}
        change="+15% from last month"
        changeType="increase"
      />
    </div>
  );
}
