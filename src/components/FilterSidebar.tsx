import { useState } from 'react';
import { X, Filter, Star } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;

  selectedRating: number;
  onRatingChange: (rating: number) => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedRating,
  onRatingChange,
}: FilterSidebarProps) {
  const renderStars = (rating: number, onClick: () => void, filled: boolean) => {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-sm hover:bg-gray-100 p-1 rounded transition-colors"
      >
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating
                  ? filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600">& above</span>
      </button>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-full md:h-auto
        w-80 md:w-full bg-white shadow-lg md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-50 md:z-auto overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'all'}
                  onChange={() => onCategoryChange('all')}
                  className="mr-2"
                />
                All Categories
              </label>
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => onCategoryChange(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>



          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Customer Rating</h4>
            <div className="space-y-1">
              <button
                onClick={() => onRatingChange(0)}
                className={`w-full text-left text-sm p-1 rounded transition-colors ${
                  selectedRating === 0 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                All Ratings
              </button>
              {[4, 3, 2, 1].map(rating => (
                <div key={rating}>
                  {renderStars(rating, () => onRatingChange(rating), selectedRating === rating)}
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              onCategoryChange('all');
              onRatingChange(0);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}