import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'خرید و پرداخت',
      questions: [
        {
          q: 'چگونه می توانم سفارش دهم',
          a: 'برای ثبت سفارش کافیست محصول مورد نظر خود را انتخاب کنید به سبد خرید اضافه کنید و مراحل پرداخت را تکمیل نمایید'
        },
        {
          q: 'روش های پرداخت چیست',
          a: 'شما می توانید از طریق درگاه بانکی کارت به کارت یا پرداخت در محل سفارش خود را پرداخت نمایید'
        },
        {
          q: 'آیا پرداخت اینترنتی امن است',
          a: 'بله تمامی پرداخت های اینترنتی از طریق درگاه بانکی معتبر و با رمزنگاری SSL انجام می شود'
        }
      ]
    },
    {
      category: 'ارسال و تحویل',
      questions: [
        {
          q: 'زمان ارسال سفارش چقدر است',
          a: 'سفارشات در شهر تهران 1 تا 2 روز کاری و شهرستان ها 2 تا 5 روز کاری ارسال می شود'
        },
        {
          q: 'هزینه ارسال چقدر است',
          a: 'هزینه ارسال برای تهران 30000 تومان و شهرستان ها 50000 تومان است برای خریدهای بالای 500000 تومان ارسال رایگان است'
        },
        {
          q: 'آیا امکان تحویل حضوری وجود دارد',
          a: 'بله می توانید از فروشگاه ما در تهران به آدرس خیابان ولیعصر پلاک 123 سفارش خود را تحویل بگیرید'
        }
      ]
    },
    {
      category: 'بازگشت و تعویض',
      questions: [
        {
          q: 'آیا امکان بازگشت کالا وجود دارد',
          a: 'بله شما می توانید تا 7 روز پس از دریافت کالا در صورت عدم رضایت آن را مرجوع کنید'
        },
        {
          q: 'شرایط بازگشت کالا چیست',
          a: 'کالا باید در بسته بندی اصلی و بدون استفاده باشد و همراه با فاکتور خرید مرجوع شود'
        },
        {
          q: 'آیا هزینه بازگشت را باید بپردازم',
          a: 'اگر دلیل بازگشت کالا نقص یا مغایرت باشد هزینه بازگشت بر عهده فروشگاه است'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <HelpCircle size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">سوالات متداول</h1>
          <p className="text-xl text-blue-100">
            پاسخ سوالات پرتکرار شما در اینجا
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded"></div>
              {category.category}
            </h2>

            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const isOpen = openIndex === `${categoryIndex}-${questionIndex}`;
                return (
                  <div
                    key={questionIndex}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-lg text-gray-900">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="text-blue-600 flex-shrink-0" size={24} />
                      ) : (
                        <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">سوال شما پاسخ داده نشد</h2>
          <p className="text-xl text-blue-100 mb-8">
            با تیم پشتیبانی ما تماس بگیرید
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

export default FAQ;