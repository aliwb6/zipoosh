import React from 'react';
import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: 'ارسال رایگان',
      description: 'برای خریدهای بالای 500 هزار تومان'
    },
    {
      icon: Shield,
      title: 'تضمین اصالت کالا',
      description: '100% اصل و با ضمانت بازگشت'
    },
    {
      icon: CreditCard,
      title: 'پرداخت امن',
      description: 'درگاه پرداخت معتبر و امن'
    },
    {
      icon: Headphones,
      title: 'پشتیبانی 24/7',
      description: 'پاسخگویی در تمام ساعات شبانه روز'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-all duration-300">
                  <IconComponent size={40} className="text-blue-600 group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;