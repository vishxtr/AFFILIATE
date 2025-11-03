import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Product } from '../lib/supabase';
import { LogOut, Plus, Trash2, Upload, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    affiliate_link: '',
    category: '',
    price: '',
    original_price: '',
    discount_percentage: '',
    rating: '',
    rating_count: '',
    badge_type: '',
    is_featured: false,
    stock_status: 'In Stock',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Import feature state
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Session timeout (30 minutes)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    function resetTimeout() {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        showNotification('error', 'Session expired. Please login again.');
      }, 30 * 60 * 1000); // 30 minutes
    }

    // Reset timeout on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    } else if (user) {
      fetchProducts();
    }
  }, [user, authLoading, navigate]);

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to logout');
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('error', 'Only JPG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size must be less than 5MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!imageFile) {
      showNotification('error', 'Please select an image');
      return;
    }

    setSubmitting(true);

    try {
      // Upload image via edge function
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-product-image', {
        body: { imageData, fileName }
      });

      if (uploadError) throw uploadError;

      // Insert product into database
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : 0,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        rating_count: formData.rating_count ? parseInt(formData.rating_count) : 0,
        badge_type: formData.badge_type || null,
        image_url: uploadData.data.publicUrl
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([productData]);

      if (insertError) throw insertError;

      showNotification('success', 'Product added successfully');
      
      // Reset form
      setFormData({ 
        name: '', 
        description: '', 
        affiliate_link: '', 
        category: '',
        price: '',
        original_price: '',
        discount_percentage: '',
        rating: '',
        rating_count: '',
        badge_type: '',
        is_featured: false,
        stock_status: 'In Stock'
      });
      setImageFile(null);
      setImagePreview(null);
      setShowAddForm(false);
      
      // Refresh products
      fetchProducts();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      showNotification('success', 'Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to delete product');
    }
  }

  async function handleImportFromUrl() {
    if (!importUrl.trim()) {
      setImportError('Please enter a product URL');
      return;
    }

    setImporting(true);
    setImportError(null);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-product-details', {
        body: { productUrl: importUrl.trim() }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch product details');
      }

      const productData = data.data;

      // Auto-fill form with fetched data
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        affiliate_link: importUrl.trim(),
        category: productData.category || '',
        price: productData.price ? productData.price.toString() : '',
        original_price: productData.original_price ? productData.original_price.toString() : '',
        discount_percentage: productData.discount_percentage ? productData.discount_percentage.toString() : '',
        rating: productData.rating ? productData.rating.toString() : '',
        rating_count: productData.rating_count ? productData.rating_count.toString() : '',
        badge_type: '',
        is_featured: false,
        stock_status: 'In Stock',
      });

      // If image URL is available, we could potentially fetch and convert it to a file
      // For now, we'll just show a message to the admin
      if (productData.image_url) {
        showNotification('success', `Product details imported successfully! Image URL found: ${productData.image_url.substring(0, 50)}...`);
      } else {
        showNotification('success', 'Product details imported successfully! Please upload an image manually.');
      }

      // Clear import fields
      setImportUrl('');
      
    } catch (error: any) {
      setImportError(error.message || 'Failed to import product details');
      showNotification('error', error.message || 'Failed to import product details');
    } finally {
      setImporting(false);
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
    <div className="min-h-screen bg-slate-50">
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

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                View Store
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Add New Product</h2>
            
            {/* Smart Import Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3">🔗 Smart Import from URL</h3>
              <p className="text-blue-700 text-sm mb-4">
                Paste a product URL from Amazon India, Flipkart, Myntra, or Snapdeal to auto-fill product details
              </p>
              
              <div className="flex gap-3">
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => {
                    setImportUrl(e.target.value);
                    setImportError(null);
                  }}
                  placeholder="https://www.amazon.in/product-link or https://www.flipkart.com/product-link"
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={importing}
                />
                <button
                  type="button"
                  onClick={handleImportFromUrl}
                  disabled={importing || !importUrl.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {importing ? 'Fetching...' : 'Fetch Details'}
                </button>
              </div>
              
              {importError && (
                <p className="text-red-600 text-sm mt-2">{importError}</p>
              )}
              
              <p className="text-blue-600 text-xs mt-2">
                Supported: Amazon India, Flipkart, Myntra, Snapdeal
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Electronics, Fashion"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Affiliate Link
                </label>
                <input
                  type="url"
                  required
                  value={formData.affiliate_link}
                  onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://example.com/product"
                />
              </div>

              {/* Pricing Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="2999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="3999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="25"
                  />
                </div>
              </div>

              {/* Rating Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.rating_count}
                    onChange={(e) => setFormData({ ...formData, rating_count: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="127"
                  />
                </div>
              </div>

              {/* Badge and Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Badge Type
                  </label>
                  <select
                    value={formData.badge_type}
                    onChange={(e) => setFormData({ ...formData, badge_type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="">No Badge</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                    <option value="HOT">HOT DEAL</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock Status
                  </label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Featured Product Toggle */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Feature this product in hero banner
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-5 h-5" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imageFile && (
                    <span className="text-sm text-slate-600">{imageFile.name}</span>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  JPG, PNG, or WebP. Max 5MB.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding Product...' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Products ({products.length})</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600">No products yet. Add your first product above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {products.map(product => (
                <div key={product.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            Category: <span className="font-medium">{product.category}</span>
                          </p>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <a
                            href={product.affiliate_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {product.affiliate_link}
                          </a>
                        </div>
                        <button
                          onClick={() => handleDelete(product)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
