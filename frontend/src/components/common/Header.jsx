import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Search,
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cartCount = getCartCount();

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categories with subcategories (Mega Menu)
  const categories = [
    {
      id: 'men',
      name: 'مردانه',
      slug: 'men',
      subcategories: [
        { name: 'تیشرت', slug: 'tshirt', icon: '👕' },
        { name: 'پیراهن', slug: 'shirt', icon: '👔' },
        { name: 'شلوار', slug: 'pants', icon: '👖' },
        { name: 'کت و شلوار', slug: 'suit', icon: '🤵' },
        { name: 'کفش', slug: 'shoes', icon: '👞' },
        { name: 'اکسسوری', slug: 'accessories', icon: '⌚' },
      ]
    },
    {
      id: 'women',
      name: 'زنانه',
      slug: 'women',
      subcategories: [
        { name: 'مانتو', slug: 'manteau', icon: '🧥' },
        { name: 'شلوار', slug: 'pants', icon: '👖' },
        { name: 'تونیک', slug: 'tunic', icon: '👗' },
        { name: 'روسری', slug: 'scarf', icon: '🧣' },
        { name: 'کفش', slug: 'shoes', icon: '👠' },
        { name: 'کیف', slug: 'bag', icon: '👜' },
      ]
    },
    {
      id: 'kids',
      name: 'بچگانه',
      slug: 'kids',
      subcategories: [
        { name: 'پسرانه', slug: 'boys', icon: '👦' },
        { name: 'دخترانه', slug: 'girls', icon: '👧' },
        { name: 'نوزاد', slug: 'baby', icon: '👶' },
        { name: 'کفش', slug: 'shoes', icon: '👟' },
        { name: 'اکسسوری', slug: 'accessories', icon: '🎒' },
      ]
    },
    {
      id: 'sale',
      name: 'فروش ویژه',
      slug: 'sale',
      badge: 'جدید',
      subcategories: [
        { name: 'تخفیف‌های ویژه', slug: 'special', icon: '🔥' },
        { name: 'حراج فصل', slug: 'season', icon: '⭐' },
      ]
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // اینجا بعداً جستجو رو پیاده می‌کنیم
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="tel:02112345678" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Phone size={16} />
                <span>021-12345678</span>
              </a>
              <a href="mailto:info@zipoosh.com" className="hidden md:flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Mail size={16} />
                <span>info@zipoosh.com</span>
              </a>
            </div>
            <div>
              <span>ارسال رایگان برای خریدهای بالای 500 هزار تومان 🎉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">ز</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-gray-900">زی‌پوش</h1>
              <p className="text-xs text-gray-500">فروشگاه آنلاین پوشاک</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در محصولات..."
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Search size={22} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="علاقه‌مندی‌ها"
            >
              <Heart size={22} className="text-gray-700" />
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="سبد خرید"
            >
              <ShoppingCart size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu - Simple Version */}
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <User size={20} />
              <span className="hidden sm:block">ورود / ثبت‌نام</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar with Mega Menu */}
      <nav className="hidden lg:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-2">
            {categories.map((category) => (
              <li 
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveMenu(category.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={`/shop/${category.slug}`}
                  className="flex items-center gap-2 px-4 py-4 hover:text-blue-600 transition-colors font-medium relative"
                >
                  {category.name}
                  {category.badge && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {category.badge}
                    </span>
                  )}
                  <ChevronDown size={16} />
                </Link>

                {/* Mega Menu Dropdown */}
                {activeMenu === category.id && (
                  <div className="absolute top-full right-0 w-64 bg-white rounded-b-lg shadow-xl border border-gray-100 py-2 z-50">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/shop/${category.slug}/${sub.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group"
                      >
                        <span className="text-2xl">{sub.icon}</span>
                        <span className="group-hover:text-blue-600 transition-colors">{sub.name}</span>
                      </Link>
                    ))}
                    <hr className="my-2" />
                    <Link
                      to={`/shop/${category.slug}`}
                      className="block px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    >
                      مشاهده همه {category.name} →
                    </Link>
                  </div>
                )}
              </li>
            ))}
            
            {/* Additional Links */}
            <li>
              <Link to="/about" className="block px-4 py-4 hover:text-blue-600 transition-colors font-medium">
                درباره ما
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block px-4 py-4 hover:text-blue-600 transition-colors font-medium">
                تماس با ما
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
          </div>

          {/* Mobile Navigation */}
          <nav className="py-2">
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  to={`/shop/${category.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{category.name}</span>
                  {category.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {category.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}
            <hr className="my-2" />
            <Link
              to="/about"
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              درباره ما
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              تماس با ما
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;