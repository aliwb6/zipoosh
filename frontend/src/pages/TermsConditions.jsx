import React from 'react';
import { FileText, CheckSquare, AlertTriangle, Scale, UserX, CreditCard } from 'lucide-react';

const TermsConditions = () => {
  const sections = [
    {
      icon: CheckSquare,
      title: 'پذیرش شرایط',
      content: 'با استفاده از خدمات فروشگاه زی پوش شما تمامی شرایط و قوانین ذکر شده در این صفحه را می پذیرید. در صورت عدم موافقت با هر یک از این شرایط لطفا از خدمات ما استفاده نکنید.'
    },
    {
      icon: UserX,
      title: 'ثبت نام و حساب کاربری',
      content: 'برای ثبت سفارش باید یک حساب کاربری ایجاد کنید. شما مسئول حفظ امنیت اطلاعات حساب خود هستید. هرگونه فعالیت از طریق حساب شما به عهده خودتان است.'
    },
    {
      icon: CreditCard,
      title: 'قیمت و پرداخت',
      content: 'تمامی قیمت ها به تومان و شامل مالیات بر ارزش افزوده است. ما حق تغییر قیمت ها را بدون اطلاع قبلی محفوظ می داریم. پرداخت باید قبل از ارسال سفارش انجام شود.'
    },
    {
      icon: Scale,
      title: 'مالکیت معنوی',
      content: 'تمامی محتوا تصاویر لوگو و طراحی سایت متعلق به فروشگاه زی پوش است. کپی برداری یا استفاده غیرمجاز از محتوای سایت ممنوع است و پیگرد قانونی دارد.'
    }
  ];

  const userResponsibilities = [
    'ارائه اطلاعات صحیح و معتبر هنگام ثبت نام',
    'عدم استفاده از حساب کاربری برای اهداف غیرقانونی',
    'حفظ امنیت رمز عبور و اطلاعات حساب کاربری',
    'رعایت قوانین و مقررات جمهوری اسلامی ایران',
    'پرداخت به موقع هزینه سفارشات',
    'تحویل به موقع سفارشات و همکاری با پیک'
  ];

  const storeRights = [
    'تغییر یا لغو سفارش در صورت عدم موجودی',
    'تغییر قیمت ها و شرایط بدون اطلاع قبلی',
    'مسدود کردن حساب کاربران متخلف',
    'رد درخواست بازگشت کالا در صورت عدم رعایت شرایط',
    'تعلیق یا قطع خدمات در مواقع ضروری',
    'تغییر یا به روزرسانی شرایط و قوانین'
  ];

  const prohibitedActivities = [
    {
      title: 'سوء استفاده از خدمات',
      description: 'استفاده از خدمات به شیوه ای که به سیستم ها آسیب برساند'
    },
    {
      title: 'اطلاعات نادرست',
      description: 'ارائه اطلاعات جعلی یا گمراه کننده'
    },
    {
      title: 'نقض حقوق دیگران',
      description: 'استفاده غیرمجاز از اطلاعات یا حساب کاربری دیگران'
    },
    {
      title: 'فعالیت های غیرقانونی',
      description: 'هرگونه فعالیت خلاف قوانین کشور'
    }
  ];

  const disputeResolution = [
    {
      step: '1',
      title: 'تماس با پشتیبانی',
      description: 'در ابتدا با تیم پشتیبانی ما تماس بگیرید'
    },
    {
      step: '2',
      title: 'بررسی شکایت',
      description: 'شکایت شما بررسی و پیگیری می شود'
    },
    {
      step: '3',
      title: 'ارائه راه حل',
      description: 'راه حل مناسب برای حل مشکل ارائه می شود'
    },
    {
      step: '4',
      title: 'پیگیری قانونی',
      description: 'در صورت عدم حل اختلاف به مراجع قانونی مراجعه شود'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <FileText size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">شرایط و قوانین</h1>
          <p className="text-xl text-blue-100">
            لطفا قبل از استفاده از خدمات این شرایط را مطالعه کنید
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <h2 className="font-bold text-2xl text-gray-900 mb-4">آخرین به روزرسانی</h2>
          <p className="text-gray-700 leading-relaxed">
            این شرایط و قوانین آخرین بار در تاریخ 1 فروردین 1404 به روزرسانی شده است. 
            ما حق تغییر این شرایط را در هر زمان محفوظ می داریم. استفاده مستمر از خدمات به معنای پذیرش تغییرات است.
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

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CheckSquare className="text-green-600" size={32} />
              مسئولیت های کاربر
            </h2>
            <ul className="space-y-3">
              {userResponsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Scale className="text-blue-600" size={32} />
              حقوق فروشگاه
            </h2>
            <ul className="space-y-3">
              {storeRights.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">●</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
            <AlertTriangle className="text-red-600" size={36} />
            فعالیت های ممنوع
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {prohibitedActivities.map((activity, index) => (
              <div key={index} className="border border-red-200 rounded-xl p-6 bg-red-50">
                <h3 className="font-bold text-lg text-red-800 mb-2">{activity.title}</h3>
                <p className="text-gray-700 text-sm">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            حل اختلاف
          </h2>
          <div className="space-y-6">
            {disputeResolution.map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">محدودیت مسئولیت</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              فروشگاه زی پوش در قبال هرگونه خسارت مستقیم یا غیرمستقیم ناشی از استفاده یا عدم امکان استفاده از خدمات مسئولیتی ندارد.
            </p>
            <p>
              ما تلاش می کنیم خدمات خود را به بهترین شکل ممکن ارائه دهیم اما نمی توانیم تضمین کنیم که خدمات همیشه بدون وقفه یا خطا باشند.
            </p>
            <p>
              کاربران موظفند قبل از خرید از صحت اطلاعات محصولات اطمینان حاصل کنند. ما در قبال اشتباهات احتمالی کاربران مسئولیتی نداریم.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={32} />
            <div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">قوانین عمومی</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>تمامی معاملات تابع قوانین جمهوری اسلامی ایران است</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>در صورت بروز اختلاف مرجع حل اختلاف دادگاه های تهران است</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>نسخه فارسی این شرایط در صورت اختلاف معتبر است</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>عدم آگاهی از قوانین دلیلی بر عدم الزام به رعایت آن نیست</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">سوال یا ابهامی دارید</h2>
          <p className="text-xl text-blue-100 mb-8">
            برای هرگونه سوال درباره شرایط و قوانین با ما تماس بگیرید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              تماس با ما
            </a>
              <a
              href="/faq"
              className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-400 transition-colors"
            >
              سوالات متداول
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;