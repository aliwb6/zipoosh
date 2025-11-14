import React from 'react';
import { Shield, Lock, Eye, UserCheck, Database, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: 'جمع آوری اطلاعات',
      content: 'ما اطلاعاتی از شما جمع آوری می کنیم که شامل نام ایمیل شماره تماس آدرس و اطلاعات پرداخت است. این اطلاعات برای پردازش سفارشات ارتباط با شما و بهبود خدمات استفاده می شود.'
    },
    {
      icon: Lock,
      title: 'امنیت اطلاعات',
      content: 'ما از روش های امنیتی پیشرفته برای محافظت از اطلاعات شما استفاده می کنیم. تمامی اطلاعات حساس با رمزنگاری SSL ذخیره و منتقل می شوند. دسترسی به اطلاعات شما محدود و تحت کنترل است.'
    },
    {
      icon: Eye,
      title: 'استفاده از اطلاعات',
      content: 'اطلاعات شما صرفا برای پردازش سفارشات ارسال کالا ارتباط با شما ارسال اطلاعیه های مهم و بهبود خدمات استفاده می شود. ما هرگز اطلاعات شما را به اشخاص ثالث نمی فروشیم.'
    },
    {
      icon: UserCheck,
      title: 'حقوق کاربران',
      content: 'شما حق دارید اطلاعات خود را مشاهده ویرایش یا حذف کنید. همچنین می توانید از دریافت ایمیل های تبلیغاتی لغو اشتراک کنید. برای هرگونه درخواست با پشتیبانی تماس بگیرید.'
    }
  ];

  const dataTypes = [
    {
      category: 'اطلاعات هویتی',
      items: ['نام و نام خانوادگی', 'شماره تماس', 'ایمیل', 'آدرس']
    },
    {
      category: 'اطلاعات پرداخت',
      items: ['شماره کارت بانکی', 'اطلاعات تراکنش', 'تاریخچه خرید']
    },
    {
      category: 'اطلاعات فنی',
      items: ['آدرس IP', 'نوع مرورگر', 'سیستم عامل', 'زمان بازدید']
    }
  ];

  const cookies = [
    {
      type: 'کوکی های ضروری',
      description: 'برای عملکرد صحیح سایت لازم هستند'
    },
    {
      type: 'کوکی های تحلیلی',
      description: 'برای بهبود عملکرد سایت استفاده می شوند'
    },
    {
      type: 'کوکی های تبلیغاتی',
      description: 'برای نمایش تبلیغات مرتبط استفاده می شوند'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Shield size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">حریم خصوصی</h1>
          <p className="text-xl text-blue-100">
            حفظ اطلاعات و حریم خصوصی شما برای ما اولویت است
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <h2 className="font-bold text-2xl text-gray-900 mb-4">درباره این سیاست</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            این سیاست حریم خصوصی نحوه جمع آوری استفاده و محافظت از اطلاعات شخصی شما در فروشگاه آنلاین زی پوش را توضیح می دهد.
          </p>
          <p className="text-gray-700 leading-relaxed">
            با استفاده از خدمات ما شما با شرایط این سیاست موافقت می کنید. لطفا این سند را با دقت مطالعه فرمایید.
          </p>
        </div>

        <div className="space-y-8 mb-20">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent size={32} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            انواع اطلاعات جمع آوری شده
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {dataTypes.map((data, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4">{data.category}</h3>
                <ul className="space-y-2">
                  {data.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">●</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            استفاده از کوکی ها
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            ما از کوکی ها برای بهبود تجربه کاربری شما استفاده می کنیم. شما می توانید از طریق تنظیمات مرورگر خود استفاده از کوکی ها را مدیریت کنید.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {cookies.map((cookie, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-3">{cookie.type}</h3>
                <p className="text-gray-600 text-sm">{cookie.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={32} />
            <div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">نکات مهم</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>ما هرگز اطلاعات شما را بدون اجازه به اشخاص ثالث نمی فروشیم</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>رمز عبور شما به صورت رمزنگاری شده ذخیره می شود</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>شما می توانید هر زمان حساب کاربری خود را حذف کنید</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>این سیاست ممکن است بدون اطلاع قبلی به روز شود</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">سوالی درباره حریم خصوصی دارید</h2>
          <p className="text-xl text-blue-100 mb-8">
            تیم ما آماده پاسخگویی به سوالات شماست
          </p>
            <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            تماس با ما
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;