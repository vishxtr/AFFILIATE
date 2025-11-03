import { Star, ExternalLink, Eye } from 'lucide-react';
import { Product } from './lib/supabase';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onViewProduct?: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onViewProduct, index = 0 }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct(product);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.05 }}
      >
        <Star
          className={`w-3 h-3 ${
            i < Math.floor(rating)
              ? 'text-yellow-500 fill-yellow-500'
              : i < rating
              ? 'text-yellow-500 fill-yellow-500 opacity-50'
              : 'text-gray-300'
          }`}
        />
      </motion.div>
    ));
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'NEW':
        return 'bg-green-600 text-white shadow-sm';
      case 'SALE':
        return 'bg-red-600 text-white shadow-sm';
      case 'HOT':
        return 'bg-orange-600 text-white shadow-sm animate-pulse';
      case 'BESTSELLER':
        return 'bg-blue-600 text-white shadow-sm';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <motion.img
          src={imageError ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' : product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="lazy"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Badge */}
        {product.badge_type && (
          <motion.div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(product.badge_type)}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.badge_type}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Category */}
        <motion.span
          className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium inline-block"
          whileHover={{ scale: 1.05 }}
        >
          {product.category}
        </motion.span>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-tight mt-3 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">
              ({product.rating_count || 0})
            </span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* View Counter */}
        {product.view_count && product.view_count > 0 && (
          <div className="flex items-center gap-1 mb-4 text-sm text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{product.view_count} views</span>
          </div>
        )}
        
        {/* Action Button */}
        <motion.a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleViewProduct}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Shop Now
          <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
}
