import { Heart, Instagram, Facebook, Twitter } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">زی‌پوش</h3>
            <p className="text-gray-400 leading-relaxed">
              فروشگاه آنلاین پوشاک با بهترین کیفیت و قیمت مناسب برای کاربران ایرانی
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">لینک‌های مفید</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">درباره ما</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">تماس با ما</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">قوانین و مقررات</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">سیاست حریم خصوصی</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">شبکه‌های اجتماعی</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-700 p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="bg-gray-700 p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="bg-gray-700 p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            ساخته شده با
            <Heart size={20} className="text-red-500" fill="currentColor" />
            برای کاربران ایرانی
          </p>
          <p className="text-gray-500 mt-2">© 2024 زی‌پوش. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer