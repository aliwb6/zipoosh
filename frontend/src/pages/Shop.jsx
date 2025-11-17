import { useState } from 'react'
import { Filter } from 'lucide-react'

function Shop() {
  const [products] = useState([
    { id: 1, name: 'تیشرت مشکی', price: '۲۵۰,۰۰۰', image: '👕' },
    { id: 2, name: 'شلوار جین', price: '۴۵۰,۰۰۰', image: '👖' },
    { id: 3, name: 'کفش اسپرت', price: '۶۵۰,۰۰۰', image: '👟' },
    { id: 4, name: 'کاپشن زمستانی', price: '۸۵۰,۰۰۰', image: '🧥' },
    { id: 5, name: 'کلاه کپ', price: '۱۵۰,۰۰۰', image: '🧢' },
    { id: 6, name: 'کوله پشتی', price: '۳۵۰,۰۰۰', image: '🎒' },
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">فروشگاه</h1>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <Filter size={20} />
            <span>فیلتر</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 flex items-center justify-center text-7xl">
                {product.image}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                <p className="text-2xl font-black text-blue-600 mb-4">
                  {product.price} تومان
                </p>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300">
                  افزودن به سبد خرید 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Shop