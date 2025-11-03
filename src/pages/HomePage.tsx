import { useState, useEffect } from 'react';
import { supabase, type Product } from './lib/supabase';
import { Search, Filter as FilterIcon, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ProductCard from './components/ProductCard';
import FilterSidebar from './components/FilterSidebar';
import Pagination from './components/Pagination';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, products, sortBy, selectedRating]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, selectedRating]);

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const suggestions = products
        .filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
        .map(p => p.name);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, products]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      
      const uniqueCategories = [...new Set((data || []).map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterAndSortProducts() {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedRating > 0) {
      filtered = filtered.filter(product => (product.rating || 0) >= selectedRating);
    }

    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(filtered);
  }

  async function handleViewProduct(product: Product) {
    try {
      await supabase
        .from('products')
        .update({ view_count: (product.view_count || 0) + 1 })
        .eq('id', product.id);
      
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id
            ? { ...p, view_count: (p.view_count || 0) + 1 }
            : p
        )
      );
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  return (
    

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          {/* Breadcrumbs */}
          {selectedCategory !== 'all' && (
            <Breadcrumbs 
              items={[
                { label: 'Products', path: '/' },
                { label: selectedCategory }
              ]} 
            />
          )}

          {/* Search and Controls */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 sm:p-3 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
              {/* Search with Autocomplete */}
              <div className="relative md:col-span-2">
                <div className="relative">
                  <FilterIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none z-10" />
                  <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-16 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  
                  {/* Search Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {searchSuggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-sm"
                            onClick={() => {
                              setSearchTerm(suggestion);
                              setShowSuggestions(false);
                            }}
                            whileHover={{ x: 5 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sort and Filter Controls */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all appearance-none bg-white cursor-pointer font-medium"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                
                <motion.button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Results Summary */}
              <div className="flex items-center justify-between mb-6">
                <motion.h2 
                  className="text-xl font-semibold text-slate-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Products ({filteredProducts.length})
                </motion.h2>
                <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600">
                  <ArrowUpDown className="w-4 h-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <motion.div 
                  className="flex justify-center items-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading products...</p>
                  </div>
                </motion.div>
              ) : currentProducts.length === 0 ? (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <FilterIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg mb-2">No products found</p>
                  <p className="text-slate-500 text-sm">Try adjusting your filters or search terms</p>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                    {currentProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewProduct={handleViewProduct}
                        index={index}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredProducts.length}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
  );
}
