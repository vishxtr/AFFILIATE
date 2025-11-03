import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4 overflow-x-auto py-2">
      <Link 
        to="/" 
        className="flex items-center hover:text-blue-600 transition-colors flex-shrink-0"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <motion.div 
          key={index} 
          className="flex items-center space-x-2 flex-shrink-0"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {item.path ? (
            <Link 
              to={item.path} 
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </nav>
  );
}
