// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// App Info
export const APP_NAME = 'زی‌پوش';
export const APP_DESCRIPTION = 'فروشگاه آنلاین پوشاک';

// Categories
export const CATEGORIES = [
  { id: 'men', name: 'مردانه', slug: 'men' },
  { id: 'women', name: 'زنانه', slug: 'women' },
  { id: 'kids', name: 'بچگانه', slug: 'kids' },
  { id: 'accessories', name: 'اکسسوری', slug: 'accessories' },
];

// Sizes
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Colors
export const COLORS = [
  { name: 'مشکی', value: '#000000' },
  { name: 'سفید', value: '#FFFFFF' },
  { name: 'قرمز', value: '#EF4444' },
  { name: 'آبی', value: '#3B82F6' },
  { name: 'سبز', value: '#10B981' },
  { name: 'زرد', value: '#F59E0B' },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
];