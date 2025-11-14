import React from 'react';
import { Truck, Package, MapPin, Clock, CheckCircle } from 'lucide-react';

const ShippingInfo = () => {
  const shippingMethods = [
    {
      icon: Truck,
      title: 'ارسال عادی',
      time: '3 تا 5 روز کاری',
      price: 'تهران 30000 - شهرستان 50000 تومان',
      description: 'ارسال با پست پیشتاز یا باربری'
    },
    {
      icon: Package,
      title: 'ارسال سریع',
      time: '1 تا 2 روز کاری',
      price: 'تهران 50000 - شهرستان 80000 تومان',
      description: 'ارسال با پیک موتوری یا تیپاکس'
    },
    {
      icon: MapPin,
      title: 'تحویل حضوری',
      time: 'همان روز',
      price: 'رایگان',
      description: 'دریافت از فروشگاه'
    }
  ];

  const process = [
    { step: '1', title: 'ثبت سفارش', description: 'سفارش خود را ثبت کنید' },
    { step: '2', title: 'تایید سفارش', description: 'سفارش شما بررسی می شود' },
    { step: '3', title: 'آماده سازی', description: 'سفارش بسته بندی می شود' },
    { step: '4', title: 'ارسال', description: 'سفارش ارسال می شود' },
    { step: '5', title: 'تحویل', description: 'سفارش به دست شما می رسد' }
  ];

  const coverage = [
    { city: 'تهران', time: '1-2 روز', price: '30000' },
    { city: 'کرج', time: '1-2 روز', price: '40000' },
    { city: 'اصفهان', time: '2-3 روز', price: '50000' },
    { city: 'مشهد', time: '2-4 روز', price: '50000' },
    { city: 'شیراز', time: '2-4 روز', price: '50000' },
    { city: 'تبریز', time: '3-5 روز', price: '50000' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Truck size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">شیوه های ارسال</h1>
          <p className="text-xl text-blue-100">
            ارسال سریع و ایمن به سراسر کشور
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {shippingMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent size={40} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                  <Clock size={20} />
                  <span className="font-medium">{method.time}</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mb-3">{method.price}</p>
                <p className="text-gray-600">{method.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            مراحل ارسال سفارش
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {process.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block w-12 h-1 bg-blue-200 flex-shrink-0"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <h2 className="text-3xl font-bold text-white text-center">پوشش ارسال</h2>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coverage.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-blue-600" size={24} />
                    <h3 className="font-bold text-xl text-gray-900">{item.city}</h3>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>زمان ارسال: {item.time}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Package size={16} />
                      <span>هزینه: {item.price} تومان</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={32} />
            مزایای ارسال زی پوش
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">ارسال رایگان برای خریدهای بالای 500000 تومان</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">بسته بندی حرفه ای و ایمن</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">پیگیری آنلاین مرسوله</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">تضمین تحویل به موقع</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;