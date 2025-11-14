import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Heart, ShoppingCart, Eye } from 'lucide-react';
import { products, getProductsByCategory, getProductsByCategoryAndSubcategory } from '../data/products';

const Shop = () => {
  const { category, subcategory } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let result = [];
    
    if (category && subcategory) {
      result = getProductsByCategoryAndSubcategory(category, subcategory);
    } else if (category) {
      result = getProductsByCategory(category);
    } else {
      result = products;
    }

    // مرتب‌سازی
    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
  }, [category, subcategory, sortBy]);

  const getCategoryName = () => {
    const categories = {
      'men': 'مردانه',
      'women': 'زنانه',
      'kids': 'بچگانه',
      'sale': 'فروش ویژه',
    };
    return categories[category] || 'همه محصولات';
  };

  const getSubcategoryName = () => {
    const subcategories = {
      'tshirt': 'تیشرت',
      'shirt': 'پیراهن',
      'pants': 'شلوار',
      'suit': 'کت و شلوار',
      'shoes': 'کفش',
      'accessories': 'اکسسوری',
      'manteau': 'مانتو',
      'tunic': 'تونیک',
      'scarf': 'روسری',
      'bag': 'کیف',
      'boys': 'پسرانه',
      'girls': 'دخترانه',
      'baby': 'نوزاد',
    };
    return subcategories[subcategory] || '';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            خانه
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/shop" className="text-gray-600 hover:text-blue-600 transition-colors">
            فروشگاه
          </Link>
          {category && (
            <>
              <span className="text-gray-400">/</span>
              <Link to={`/shop/${category}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                {getCategoryName()}
              </Link>
            </>
          )}
          {subcategory && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{getSubcategoryName()}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {subcategory ? getSubcategoryName() : getCategoryName()}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} محصول یافت شد
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="name">الفبایی</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* محصولات */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    {product.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    <Link to={`/product/${product.id}`} className="block relative">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                        <div className="text-9xl group-hover:scale-110 transition-transform duration-300">
                          {product.image}
                        </div>

                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button 
                            onClick={(e) => e.preventDefault()}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                          >
                            <Heart size={20} />
                          </button>
                          <button 
                            onClick={(e) => e.preventDefault()}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                          >
                            <Eye size={20} />
                          </button>
                          <button 
                            onClick={(e) => e.preventDefault()}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                          >
                            <ShoppingCart size={20} />
                          </button>
                        </div>
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 mr-2">({product.rating})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {product.colors.slice(0, 3).map((color, idx) => (
                          <div key={idx} className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-200" title={color}></div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-blue-600 font-bold text-xl">
                            {formatPrice(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-gray-400 line-through text-sm mr-2">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <Link to={`/product/${product.id}`} className="flex gap-4 p-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-5xl flex-shrink-0">
                      {product.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-3">دسته‌بندی: {getCategoryName()} {getSubcategoryName() && `- ${getSubcategoryName()}`}</p>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-blue-600 font-bold text-xl">
                          {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-gray-400 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 mr-2">({product.reviews} نظر)</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          // محصولی یافت نشد
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              محصولی یافت نشد
            </h3>
            <p className="text-gray-600 mb-6">
              متأسفانه در این دسته‌بندی محصولی موجود نیست
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              مشاهده همه محصولات
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;