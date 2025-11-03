import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ExternalLink } from 'lucide-react';
import { Product } from './lib/supabase';

interface HeroBannerProps {
  featuredProducts: Product[];
}

export default function HeroBanner({ featuredProducts }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-scroll carousel
  useEffect(() => {
    if (featuredProducts.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  if (!featuredProducts.length) {
    return (
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-lg overflow-hidden mb-6 sm:mb-8 shadow-2xl">
        <div className="px-4 py-6 sm:px-8 sm:py-12 md:py-16 text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-4 animate-pulse">Welcome to Best Deals</h2>
          <p className="text-sm sm:text-base md:text-xl opacity-90">Discover amazing products at unbeatable prices</p>
        </div>
      </div>
    );
  }

  const currentProduct = featuredProducts[currentSlide];

  return (
    <div className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-2xl">
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 items-center min-h-[200px] sm:min-h-[250px] md:min-h-[400px]">
        {/* Content Side */}
        <div className="p-3 sm:p-4 md:p-12 text-white col-span-1">
          <div className="space-y-2 sm:space-y-3">
            {currentProduct.badge_type && (
              <div className="inline-block">
                <span className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg ${
                  currentProduct.badge_type === 'NEW' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                  currentProduct.badge_type === 'SALE' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                  currentProduct.badge_type === 'HOT' ? 'bg-gradient-to-r from-orange-500 to-red-600 animate-pulse' :
                  'bg-gradient-to-r from-purple-500 to-indigo-600'
                }`}>
                  {currentProduct.badge_type}
                </span>
              </div>
            )}
            
            <h2 className="text-sm sm:text-lg md:text-4xl font-bold leading-tight line-clamp-2 sm:line-clamp-3">
              {currentProduct.name}
            </h2>
            
            <p className="text-xs sm:text-sm md:text-lg opacity-90 line-clamp-2 sm:line-clamp-3">
              {currentProduct.description}
            </p>
            
            {/* Rating */}
            {currentProduct.rating && currentProduct.rating > 0 && (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        i < Math.floor(currentProduct.rating!)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm opacity-90">
                  ({currentProduct.rating_count || 0})
                </span>
              </div>
            )}
            
            <a
              href={currentProduct.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 md:py-3 md:px-8 rounded-lg transition-all duration-300 text-xs sm:text-sm md:text-lg shadow-lg hover:shadow-2xl hover:scale-105"
            >
              Shop Now
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </div>
        
        {/* Image Side */}
        <div className="relative h-[180px] sm:h-[220px] md:h-96 col-span-1">
          <img
            src={currentProduct.image_url}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {featuredProducts.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Slide Indicators */}
      {featuredProducts.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}