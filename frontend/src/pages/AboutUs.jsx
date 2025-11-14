import React from 'react';
import { Heart, Shield, Truck, Award, Users, Target } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const AboutUs = () => {
  const features = [
    {
      icon: Shield,
      title: 'کیفیت تضمین شده',
      description: 'تمامی محصولات دارای ضمانت اصالت و کیفیت هستند'
    },
    {
      icon: Truck,
      title: 'ارسال سریع',
      description: 'ارسال به سراسر کشور با سریعترین زمان ممکن'
    },
    {
      icon: Award,
      title: 'برندهای معتبر',
      description: 'همکاری با معتبرترین برندهای داخلی و خارجی'
    },
    {
      icon: Users,
      title: 'پشتیبانی 24/7',
      description: 'تیم پشتیبانی ما همیشه در خدمت شما هستند'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'مشتری راضی' },
    { number: '10,000+', label: 'محصول متنوع' },
    { number: '5+', label: 'سال تجربه' },
    { number: '100%', label: 'رضایت مشتری' }
  ];

  const team = [
    { name: 'علی محمدی', role: 'مدیرعامل', image: '👨‍💼' },
    { name: 'سارا احمدی', role: 'مدیر فروش', image: '👩‍💼' },
    { name: 'رضا کریمی', role: 'مدیر فنی', image: '👨‍💻' },
    { name: 'مریم حسینی', role: 'مدیر بازاریابی', image: '👩‍💻' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">درباره {APP_NAME}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              ما با هدف ارائه بهترین محصولات پوشاک با کیفیت برتر و قیمت مناسب 
              در خدمت شما عزیزان هستیم
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">داستان ما</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                {APP_NAME} در سال 2019 با هدف تغییر تجربه خرید آنلاین پوشاک در ایران 
                تاسیس شد. ما با ایمان به اینکه هر فردی حق دارد به راحتی و با اطمینان 
                خاطر محصولات با کیفیت را خریداری کند این مسیر را آغاز کردیم
              </p>
              <p>
                امروز با بیش از 50000 مشتری راضی و همکاری با معتبرترین برندهای 
                داخلی و خارجی افتخار میکنیم که یکی از پیشگامان صنعت فروش آنلاین 
                پوشاک در کشور باشیم
              </p>
              <p>
                ماموریت ما ساده است ارائه بهترین محصولات با بهترین قیمت همراه با 
                بهترین خدمات پس از فروش
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-9xl">
              🏬
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">چرا {APP_NAME}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ما با ارائه خدمات برتر تلاش میکنیم بهترین تجربه خرید را برای شما فراهم کنیم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={40} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تیم ما</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            افرادی متخصص و با انگیزه که همیشه در تلاش برای ارائه بهترین خدمات هستند
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden text-center">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-8xl">
                {member.image}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ارزش های ما</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">مشتری محوری</h3>
              <p className="text-blue-100">رضایت شما اولویت اول ماست</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">صداقت و شفافیت</h3>
              <p className="text-blue-100">همیشه صادق و شفاف با شما هستیم</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">کیفیت برتر</h3>
              <p className="text-blue-100">فقط بهترین ها را ارائه می دهیم</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">آماده شروع خرید هستید</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            همین حالا از تخفیف های ویژه ما استفاده کنید و از خرید لذت ببرید
          </p>
            <a
            href="/shop"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
            مشاهده محصولات
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;