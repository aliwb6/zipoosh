import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { getFeaturedProducts } from '../../data/products';

const FeaturedProducts = () => {
  const products = getFeaturedProducts().slice(0, 4); // فقط 4 محصول

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">محصولات ویژه</h2>
          <p className="text-xl text-gray-600">برترین محصولات ما را کشف کنید</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
            >
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
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-bold text-xl">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;