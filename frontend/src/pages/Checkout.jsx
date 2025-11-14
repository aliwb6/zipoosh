import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, MapPin, User, Phone, Mail, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // اطلاعات شخصی
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // آدرس
    province: '',
    city: '',
    address: '',
    postalCode: '',
    // روش ارسال
    shippingMethod: 'standard',
    // روش پرداخت
    paymentMethod: 'online',
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // محاسبات
  const subtotal = getCartTotal();
  const shippingCost = subtotal > 500000 ? 0 : formData.shippingMethod === 'express' ? 50000 : 30000;
  const finalTotal = subtotal + shippingCost;

  // روش‌های ارسال
  const shippingMethods = [
    { id: 'standard', name: 'ارسال عادی', time: '3-5 روز کاری', cost: 30000 },
    { id: 'express', name: 'ارسال سریع', time: '1-2 روز کاری', cost: 50000 },
  ];

  // روش‌های پرداخت
  const paymentMethods = [
    { id: 'online', name: 'پرداخت آنلاین', icon: '💳', description: 'پرداخت با کارت بانکی' },
    { id: 'cod', name: 'پرداخت در محل', icon: '💵', description: 'پرداخت هنگام دریافت کالا' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // پاک کردن خطا وقتی کاربر شروع به تایپ می‌کنه
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.phone.trim()) newErrors.phone = 'شماره تماس الزامی است';
    else if (!/^09\d{9}$/.test(formData.phone)) newErrors.phone = 'شماره تماس معتبر نیست';
    if (!formData.email.trim()) newErrors.email = 'ایمیل الزامی است';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'ایمیل معتبر نیست';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.province.trim()) newErrors.province = 'استان الزامی است';
    if (!formData.city.trim()) newErrors.city = 'شهر الزامی است';
    if (!formData.address.trim()) newErrors.address = 'آدرس الزامی است';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'کد پستی الزامی است';
    else if (!/^\d{10}$/.test(formData.postalCode)) newErrors.postalCode = 'کد پستی باید 10 رقم باشد';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = () => {
    // اینجا بعداً با API وصل می‌کنیم
    console.log('Order Data:', {
      ...formData,
      cartItems,
      subtotal,
      shippingCost,
      finalTotal
    });

    // خالی کردن سبد
    clearCart();

    // رفتن به صفحه تایید
    navigate('/order-success', { 
      state: { 
        orderNumber: Math.floor(Math.random() * 1000000),
        total: finalTotal 
      } 
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">سبد خرید شما خالی است</h2>
          <p className="text-gray-600 mb-8">برای ادامه خرید، محصولات را به سبد اضافه کنید</p>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">تسویه حساب</h1>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  <span className={`text-sm mt-2 ${currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {step === 1 && 'اطلاعات'}
                    {step === 2 && 'آدرس'}
                    {step === 3 && 'ارسال و پرداخت'}
                    {step === 4 && 'بررسی نهایی'}
                  </span>
                </div>
                {step < 4 && (
                  <div className={`h-1 flex-1 mx-2 transition-all ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* فرم */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* مرحله 1: اطلاعات شخصی */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-blue-600" size={32} />
                    <h2 className="text-2xl font-bold text-gray-900">اطلاعات شخصی</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="نام خود را وارد کنید"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="نام خانوادگی خود را وارد کنید"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="09123456789"
                        dir="ltr"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="email@example.com"
                        dir="ltr"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* مرحله 2: آدرس */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="text-blue-600" size={32} />
                    <h2 className="text-2xl font-bold text-gray-900">آدرس تحویل</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">استان *</label>
                        <select
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            errors.province ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                          }`}
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="tehran">تهران</option>
                          <option value="isfahan">اصفهان</option>
                          <option value="shiraz">شیراز</option>
                          <option value="mashhad">مشهد</option>
                          <option value="tabriz">تبریز</option>
                        </select>
                        {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">شهر *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            errors.city ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="شهر خود را وارد کنید"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">آدرس کامل *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.address ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="آدرس کامل پستی خود را وارد کنید"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">کد پستی *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.postalCode ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="1234567890"
                        maxLength="10"
                        dir="ltr"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* مرحله 3: روش ارسال و پرداخت */}
              {currentStep === 3 && (
                <div>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="text-blue-600" size={32} />
                      <h2 className="text-2xl font-bold text-gray-900">روش ارسال</h2>
                    </div>

                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.shippingMethod === method.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={method.id}
                              checked={formData.shippingMethod === method.id}
                              onChange={handleInputChange}
                              className="w-5 h-5"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{method.name}</p>
                              <p className="text-sm text-gray-600">{method.time}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-blue-600">
                              {subtotal > 500000 ? (
                                <span className="text-green-600">رایگان</span>
                              ) : (
                                formatPrice(method.cost)
                              )}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="text-blue-600" size={32} />
                      <h2 className="text-2xl font-bold text-gray-900">روش پرداخت</h2>
                    </div>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={formData.paymentMethod === method.id}
                              onChange={handleInputChange}
                              className="w-5 h-5"
                            />
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{method.icon}</span>
                              <div>
                                <p className="font-bold text-gray-900">{method.name}</p>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* مرحله 4: بررسی نهایی */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="text-blue-600" size={32} />
                    <h2 className="text-2xl font-bold text-gray-900">بررسی نهایی</h2>
                  </div>

                  <div className="space-y-6">
                    {/* اطلاعات شخصی */}
                    <div className="border-2 border-gray-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">اطلاعات شخصی</h3>
                      <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">نام:</span> {formData.firstName} {formData.lastName}</p>
                        <p><span className="font-medium">تلفن:</span> {formData.phone}</p>
                        <p><span className="font-medium">ایمیل:</span> {formData.email}</p>
                      </div>
                    </div>

                    {/* آدرس */}
                    <div className="border-2 border-gray-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">آدرس تحویل</h3>
                      <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">استان:</span> {formData.province}</p>
                        <p><span className="font-medium">شهر:</span> {formData.city}</p>
                        <p><span className="font-medium">آدرس:</span> {formData.address}</p>
                        <p><span className="font-medium">کد پستی:</span> {formData.postalCode}</p>
                      </div>
                    </div>

                    {/* روش ارسال و پرداخت */}
                    <div className="border-2 border-gray-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">روش ارسال و پرداخت</h3>
                      <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">روش ارسال:</span> {
                          shippingMethods.find(m => m.id === formData.shippingMethod)?.name
                        }</p>
                        <p><span className="font-medium">روش پرداخت:</span> {
                          paymentMethods.find(m => m.id === formData.paymentMethod)?.name
                        }</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* دکمه‌های ناوبری */}
              <div className="flex items-center gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                  >
                    مرحله قبل
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    مرحله بعد
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                  >
                    ثبت نهایی سفارش
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* خلاصه سفارش */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">خلاصه سفارش</h2>

              {/* محصولات */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-600">سایز: {item.size} | رنگ: {item.color}</p>
                      <p className="text-sm text-blue-600 font-bold">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* محاسبات */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>جمع محصولات:</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
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

                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">مجموع:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;