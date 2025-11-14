import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Send,
  Heart,
} from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">ز</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{APP_NAME}</h3>
                <p className="text-xs text-gray-400">فروشگاه آنلاین پوشاک</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {APP_NAME} با ارائه بهترین محصولات پوشاک با کیفیت برتر، همراه شما در انتخاب بهترین‌هاست.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com/zipoosh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://t.me/zipoosh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="hover:text-blue-400 transition-colors text-sm">
                  فروشگاه
                </Link>
              </li>
              <li>
                <Link to="/shop/men" className="hover:text-blue-400 transition-colors text-sm">
                  پوشاک مردانه
                </Link>
              </li>
              <li>
                <Link to="/shop/women" className="hover:text-blue-400 transition-colors text-sm">
                  پوشاک زنانه
                </Link>
              </li>
              <li>
                <Link to="/shop/kids" className="hover:text-blue-400 transition-colors text-sm">
                  پوشاک بچگانه
                </Link>
              </li>
              <li>
                <Link to="/shop/sale" className="hover:text-blue-400 transition-colors text-sm">
                  فروش ویژه
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-4">خدمات مشتریان</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors text-sm">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors text-sm">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors text-sm">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-blue-400 transition-colors text-sm">
                  راهنمای سایز
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-blue-400 transition-colors text-sm">
                  شیوه‌های ارسال
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-blue-400 transition-colors text-sm">
                  قوانین بازگشت کالا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">تلفن پشتیبانی:</p>
                  <a href="tel:02112345678" className="text-white hover:text-blue-400 transition-colors">
                    021-12345678
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">ایمیل:</p>
                  <a href="mailto:info@zipoosh.com" className="text-white hover:text-blue-400 transition-colors">
                    info@zipoosh.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">آدرس:</p>
                  <p className="text-white">تهران، خیابان ولیعصر، پلاک 123</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-right">
              © {currentYear} {APP_NAME}. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm hover:text-blue-400 transition-colors">
                حریم خصوصی
              </Link>
              <Link to="/terms" className="text-sm hover:text-blue-400 transition-colors">
                شرایط و قوانین
              </Link>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
            ساخته شده با <Heart size={14} className="text-red-500 fill-red-500" /> توسط تیم زی‌پوش
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;