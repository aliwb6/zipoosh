import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Share2, Minus, Plus, Star, Truck, RefreshCw, Shield } from 'lucide-react';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const foundProduct = getProductById(id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
      setSelectedColor(foundProduct.colors[0]);
    } else {
      navigate('/shop');
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('لطفاً سایز و رنگ را انتخاب کنید');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const productInCart = isInCart(product.id);

  // محصولات مرتبط
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              خانه
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/shop" className="text-gray-600 hover:text-blue-600 transition-colors">
              فروشگاه
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* تصاویر محصول */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-9xl">{product.images[selectedImage]}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-4 transition-all ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="text-5xl">{image}</div>
                </button>
              ))}
            </div>
          </div>

          {/* اطلاعات محصول */}
          <div>
            {product.badge && (
              <span className="inline-block px-4 py-2 bg-red-500 text-white font-bold rounded-full mb-4">
                {product.badge}
              </span>
            )}

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* امتیاز */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} نظر)</span>
            </div>

            {/* قیمت */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 font-bold rounded-full text-sm">
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% تخفیف
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* توضیحات */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* انتخاب سایز */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-bold text-gray-900">سایز:</label>
                <Link to="/size-guide" className="text-sm text-blue-600 hover:text-blue-700">
                  راهنمای سایز
                </Link>
              </div>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-lg font-bold transition-all ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* انتخاب رنگ */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">رنگ:</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* تعداد */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">تعداد:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg border-x-2 border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.inStock ? 'موجود در انبار' : 'ناموجود'}
                </span>
              </div>
            </div>

            {/* دکمه‌های اصلی */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={24} />
                {addedToCart ? '✓ به سبد اضافه شد' : productInCart ? 'افزودن مجدد' : 'افزودن به سبد خرید'}
              </button>

              <button className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all">
                <Heart size={24} className="text-gray-600 hover:text-red-500" />
              </button>

              <button className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <Share2 size={24} className="text-gray-600 hover:text-blue-500" />
              </button>
            </div>

            {/* پیام موفقیت */}
            {addedToCart && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center gap-3 animate-pulse">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-green-800">محصول به سبد خرید اضافه شد!</p>
                  <Link to="/cart" className="text-sm text-green-600 hover:text-green-700 underline">
                    مشاهده سبد خرید
                  </Link>
                </div>
              </div>
            )}

            {/* ویژگی‌های اضافی */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="text-blue-600" size={24} />
                </div>
                <p className="text-sm text-gray-600">ارسال رایگان</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="text-green-600" size={24} />
                </div>
                <p className="text-sm text-gray-600">7 روز ضمانت بازگشت</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="text-purple-600" size={24} />
                </div>
                <p className="text-sm text-gray-600">ضمانت اصالت</p>
              </div>
            </div>
          </div>
        </div>

        {/* محصولات مرتبط */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-xl overflow-hidden">
                    <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                      {relatedProduct.image}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-xl">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;