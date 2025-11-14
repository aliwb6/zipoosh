import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const shippingCost = getCartTotal() > 500000 ? 0 : 30000;
  const finalTotal = getCartTotal() + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={120} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">سبد خرید شما خالی است</h2>
          <p className="text-gray-600 mb-8">هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">سبد خرید</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowRight size={20} />
            بازگشت
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* لیست محصولات */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartId} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex gap-6">
                  {/* تصویر محصول */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-6xl">
                      {item.image}
                    </div>
                  </Link>

                  {/* اطلاعات محصول */}
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">رنگ:</span> {item.color}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">سایز:</span> {item.size}
                      </p>
                      <p className="text-blue-600 font-bold text-xl">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* تعداد */}
                      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-bold border-x-2 border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* حذف */}
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* قیمت کل */}
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* دکمه خالی کردن سبد */}
            <button
              onClick={clearCart}
              className="w-full px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors"
            >
              خالی کردن سبد خرید
            </button>
          </div>

          {/* خلاصه سفارش */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">خلاصه سفارش</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>جمع محصولات:</span>
                  <span className="font-bold">{formatPrice(getCartTotal())}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال:</span>
                  <span className="font-bold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">رایگان</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                {getCartTotal() > 500000 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
                    🎉 شما از ارسال رایگان بهره‌مند شدید!
                  </div>
                )}

                {getCartTotal() < 500000 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm">
                    💡 تا ارسال رایگان {formatPrice(500000 - getCartTotal())} باقی مانده
                  </div>
                )}

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">مجموع:</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                ادامه فرآیند خرید
              </button>

              <Link
                to="/shop"
                className="block w-full px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors mt-3"
              >
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;