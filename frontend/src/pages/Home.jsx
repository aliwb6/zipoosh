import { Link } from 'react-router-dom'
import { ShoppingBag, TrendingUp, Heart, Truck } from 'lucide-react'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            به زی‌پوش خوش آمدید
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            جدیدترین و بهترین پوشاک را با ما تجربه کنید
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            مشاهده محصولات 🛍️
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">خرید آسان</h3>
              <p className="text-gray-600">فرآیند خرید سریع و آسان</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">کیفیت بالا</h3>
              <p className="text-gray-600">بهترین کیفیت محصولات</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-pink-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">رضایت مشتری</h3>
              <p className="text-gray-600">رضایت ۱۰۰٪ تضمینی</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">ارسال رایگان</h3>
              <p className="text-gray-600">برای خریدهای بالای ۵۰۰ هزار</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">
            همین الان شروع کنید!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            به جمع هزاران مشتری راضی زی‌پوش بپیوندید
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            خرید کنید 🛒
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home