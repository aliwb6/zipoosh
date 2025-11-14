import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    // اگر داده‌ای نداشتیم، برگرد به خانه
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon Animation */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <CheckCircle size={80} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-3">سفارش شما ثبت شد! 🎉</h1>
            <p className="text-green-100 text-lg">
              از خرید شما سپاسگزاریم
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Order Number */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
              <p className="text-gray-600 mb-2">شماره سفارش شما</p>
              <p className="text-3xl font-bold text-blue-600">
                #{orderData.orderNumber}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                این شماره را برای پیگیری سفارش یادداشت کنید
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">مبلغ کل:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(orderData.total)}
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg text-gray-900 mb-4">مراحل بعدی</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">بررسی و تایید سفارش</p>
                    <p className="text-sm text-gray-600">سفارش شما در حال بررسی است</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">آماده سازی</p>
                    <p className="text-sm text-gray-600">محصولات شما بسته بندی می‌شود</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">ارسال</p>
                    <p className="text-sm text-gray-600">سفارش به آدرس شما ارسال می‌شود</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Notification */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <p className="text-yellow-800 text-sm">
                📧 یک ایمیل تایید به آدرس ایمیل شما ارسال شده است
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/shop"
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag size={20} />
                ادامه خرید
              </Link>

              <Link
                to="/"
                className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
              >
                <Home size={20} />
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              برای پیگیری سفارش می‌توانید به{' '}
              <Link to="/dashboard/orders" className="text-blue-600 hover:text-blue-700 font-medium">
                پنل کاربری
              </Link>{' '}
              مراجعه کنید
            </p>
          </div>
        </div>

        {/* Support Box */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-3">سوال یا مشکلی دارید؟</p>
            <div className="flex items-center justify-center gap-6">
              <a
                href="tel:02112345678"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                📞 021-12345678
              </a>
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                💬 تماس با پشتیبانی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;