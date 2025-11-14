import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { APP_NAME } from '../utils/constants';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'تلفن پشتیبانی',
      info: '021-12345678',
      description: 'پاسخگویی از 9 صبح تا 6 عصر'
    },
    {
      icon: Mail,
      title: 'ایمیل',
      info: 'info@zipoosh.com',
      description: 'پاسخ در کمتر از 24 ساعت'
    },
    {
      icon: MapPin,
      title: 'آدرس',
      info: 'تهران خیابان ولیعصر پلاک 123',
      description: 'طبقه 3 واحد 8'
    },
    {
      icon: Clock,
      title: 'ساعات کاری',
      info: 'شنبه تا پنجشنبه',
      description: '9:00 صبح تا 18:00 عصر'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-xl text-blue-100">
            ما همیشه آماده پاسخگویی به سوالات و پیشنهادات شما هستیم
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent size={32} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-blue-600 font-medium mb-1">{item.info}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">پیام خود را ارسال کنید</h2>
            <p className="text-gray-600 mb-8">
              لطفا فرم زیر را پر کنید تا در اسرع وقت با شما تماس بگیریم
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">پیام شما ارسال شد</h3>
                <p className="text-green-600">
                  با تشکر از تماس شما در اسرع وقت پاسخ خواهیم داد
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="نام و نام خانوادگی"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="نام کامل خود را وارد کنید"
                  required
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="ایمیل"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />

                  <Input
                    label="شماره تماس"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09123456789"
                    required
                  />
                </div>

                <Input
                  label="موضوع"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="موضوع پیام خود را وارد کنید"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    پیام شما
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="پیام خود را بنویسید"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  <Send size={20} />
                  ارسال پیام
                </Button>
              </form>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">موقعیت ما در نقشه</h2>
            <div className="bg-gray-200 rounded-xl overflow-hidden h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={64} className="mx-auto mb-4" />
                <p className="text-lg">نقشه در اینجا نمایش داده می شود</p>
                <p className="text-sm mt-2">تهران خیابان ولیعصر پلاک 123</p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">راه های ارتباطی</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-blue-600" />
                  <span>تلفن: 021-12345678</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={20} className="text-blue-600" />
                  <span>ایمیل: info@zipoosh.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={20} className="text-blue-600" />
                  <span>آدرس: تهران خیابان ولیعصر پلاک 123</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;