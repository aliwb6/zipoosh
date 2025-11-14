import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { SIZES, COLORS, SORT_OPTIONS } from '../../utils/constants';

const FilterSidebar = ({ filters, setFilters, onClose, isMobile }) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const priceRanges = [
    { min: 0, max: 500000, label: 'زیر 500 هزار تومان' },
    { min: 500000, max: 1000000, label: '500 تا 1 میلیون' },
    { min: 1000000, max: 2000000, label: '1 تا 2 میلیون' },
    { min: 2000000, max: 5000000, label: '2 تا 5 میلیون' },
    { min: 5000000, max: Infinity, label: 'بالای 5 میلیون' },
  ];

  const categories = [
    { value: 'all', label: 'همه محصولات' },
    { value: 'men', label: 'مردانه' },
    { value: 'women', label: 'زنانه' },
    { value: 'kids', label: 'بچگانه' },
    { value: 'accessories', label: 'اکسسوری' },
  ];

  const handlePriceChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange?.min === range.min ? null : range
    }));
  };

  const handleSizeToggle = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }));
  };

  const handleColorToggle = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors?.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...(prev.colors || []), color]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      priceRange: null,
      sizes: [],
      colors: [],
      sortBy: 'newest'
    });
  };

  return (
    <div className={`bg-white ${isMobile ? 'fixed inset-0 z-50 overflow-y-auto' : 'sticky top-24'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">فیلترها</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Clear Filters */}
        <button
          onClick={clearAllFilters}
          className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
        >
          پاک کردن همه فیلترها
        </button>

        {/* Category Filter */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="font-bold text-lg">دسته‌بندی</h3>
            {openSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections.category && (
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat.value}
                    onChange={() => setFilters(prev => ({ ...prev, category: cat.value }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="font-bold text-lg">قیمت</h3>
            {openSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections.price && (
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.priceRange?.min === range.min}
                    onChange={() => handlePriceChange(range)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="font-bold text-lg">سایز</h3>
            {openSections.size ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections.size && (
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    filters.sizes?.includes(size)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="font-bold text-lg">رنگ</h3>
            {openSections.color ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections.color && (
            <div className="flex flex-wrap gap-3">
              {COLORS.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleColorToggle(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    filters.colors?.includes(color.value)
                      ? 'border-blue-600 scale-110'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="sticky bottom-0 p-4 bg-white border-t">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            اعمال فیلترها
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;