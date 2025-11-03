import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const location = useLocation();

  const navigationLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  const categoryLinks = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <motion.img 
              src="/best-deals-logo.png" 
              alt="Best Deals Logo" 
              className="h-12 sm:h-14 lg:h-16 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-slate-900">Best Deals</h1>
              <p className="text-slate-600 text-xs sm:text-sm hidden sm:block">Discover amazing products</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(link.path) ? 'text-blue-600' : 'text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                    onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2"
                  >
                    {categoryLinks.map((category) => (
                      <Link
                        key={category}
                        to={`/?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/admin/login"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors px-3 py-1 rounded-md hover:bg-slate-100"
            >
              Admin Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <nav className="pt-4 pb-2 space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Categories */}
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Categories</p>
                  {categoryLinks.map((category) => (
                    <Link
                      key={category}
                      to={`/?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-md text-base text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-md text-base text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-200 mt-2 pt-4"
                >
                  Admin Login
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
