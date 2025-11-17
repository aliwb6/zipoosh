import { Link } from 'react-router-dom'
import { ShoppingCart, Home as HomeIcon, Store, User, Menu } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const [cartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              زی‌پوش
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium"
            >
              <HomeIcon size={20} />
              <span>خانه</span>
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium"
            >
              <Store size={20} />
              <span>فروشگاه</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
            >
              <ShoppingCart size={20} />
              <span>سبد خرید</span>
              {cartCount > 0 && (
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="text-gray-700 hover:text-blue-600 transition-all duration-300">
              <User size={24} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="flex items-center gap-2 py-3 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HomeIcon size={20} />
              <span>خانه</span>
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 py-3 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Store size={20} />
              <span>فروشگاه</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 py-3 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart size={20} />
              <span>سبد خرید ({cartCount})</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar