import React from 'react';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ReturnPolicy = () => {
  const returnConditions = [
    {
      icon: CheckCircle,
      title: 'شرایط پذیرش',
      items: [
        'کالا در بسته بندی اصلی و دست نخورده باشد',
        'برچسب ها و تگ های اصلی کالا سالم باشد',
        'فاکتور خرید همراه کالا ارسال شود',
        'حداکثر 7 روز از زمان تحویل گذشته باشد'
      ]
    },
    {
      icon: XCircle,
      title: 'موارد غیرقابل بازگشت',
      items: [
        'لباس های زیر و لباس خواب',
        'کالاهای تخفیف خورده بالای 50 درصد',
        'محصولات سفارشی و شخصی سازی شده',
        'کالاهایی که استفاده شده اند'
      ]
    }
  ];

  const returnSteps = [
    {
      step: '1',
      title: 'درخواست بازگشت',
      description: 'از طریق پنل کاربری یا تماس با پشتیبانی درخواست دهید'
    },
    {
      step: '2',
      title: 'تایید درخواست',
      description: 'درخواست شما بررسی و تایید می شود'
    },
    {
      step: '3',
      title: 'ارسال کالا',
      description: 'کالا را با بسته بندی مناسب ارسال کنید'
    },
    {
      step: '4',
      title: 'بازرسی کالا',
      description: 'کالا بازرسی و وضعیت آن بررسی می شود'
    },
    {
      step: '5',
      title: 'بازگشت وجه',
      description: 'وجه به حساب شما واریز می شود'
    }
  ];

  const refundMethods = [
    {
      title: 'بازگشت به کیف پول',
      time: 'فوری',
      description: 'واریز به کیف پول سایت برای خرید بعدی'
    },
    {
      title: 'واریز به کارت',
      time: '3 تا 5 روز کاری',
      description: 'واریز مستقیم به شماره کارت'
    },
    {
      title: 'واریز به حساب بانکی',
      time: '3 تا 7 روز کاری',
      description: 'واریز به شماره حساب بانکی'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <RefreshCw size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">قوانین بازگشت کالا</h1>
          <p className="text-xl text-blue-100">
            رضایت شما برای ما مهم است
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <Clock className="text-blue-600 flex-shrink-0" size={32} />
            <div>
              <h3 className="font-bold text-2xl text-gray-900 mb-3">مهلت بازگشت کالا</h3>
              <p className="text-gray-700 leading-relaxed">
                شما می توانید تا 7 روز پس از تحویل کالا در صورت عدم رضایت یا وجود هرگونه مشکل 
                درخواست بازگشت کالا را ثبت نمایید. این مهلت از زمان تحویل کالا به شما محاسبه می شود.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {returnConditions.map((condition, index) => {
            const IconComponent = condition.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    condition.icon === CheckCircle ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <IconComponent size={32} className={
                      condition.icon === CheckCircle ? 'text-green-600' : 'text-red-600'
                    } />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{condition.title}</h3>
                </div>
                <ul className="space-y-3">
                  {condition.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`mt-1 ${
                        condition.icon === CheckCircle ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {condition.icon === CheckCircle ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            مراحل بازگشت کالا
          </h2>
          <div className="space-y-6">
            {returnSteps.map((item, index) => (
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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <h2 className="text-3xl font-bold text-white text-center">روش های بازگشت وجه</h2>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {refundMethods.map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{method.title}</h3>
                  <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                    {method.time}
                  </div>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={32} />
            <div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">نکات مهم</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>هزینه ارسال بازگشت در صورت معیوب بودن کالا بر عهده فروشگاه است</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>برای کالاهای بالای 1000000 تومان بازرسی دقیق تری انجام می شود</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>در صورت تایید درخواست حداکثر تا 10 روز کاری وجه به حساب شما واریز می شود</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">●</span>
                  <span>برای تعویض کالا با پشتیبانی تماس بگیرید</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">سوالی دارید</h2>
            <p className="text-xl text-blue-100 mb-8">
              تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
            </p>
              <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              تماس با پشتیبانی
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;