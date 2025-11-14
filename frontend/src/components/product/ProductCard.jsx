import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1, 'M', 'مشکی');
  };

  const discountPercentage = product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="card group overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
       <img
            src={product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="533"%3E%3Crect fill="%23ddd" width="400" height="533"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="24" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EProduct%3C/text%3E%3C/svg%3E'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discountPercentage}%
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            <span>افزودن به سبد</span>
          </button>
          <button className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Heart size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          {product.discountedPrice ? (
            <>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(product.discountedPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-2 mt-3">
            {product.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;