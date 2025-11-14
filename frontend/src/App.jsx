import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import FAQ from './pages/FAQ.jsx';
import SizeGuide from './pages/SizeGuide.jsx';
import ShippingInfo from './pages/ShippingInfo.jsx';
import ReturnPolicy from './pages/ReturnPolicy.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Routes>
          {/* صفحه اصلی */}
          <Route path="/" element={<Home />} />
          
          {/* فروشگاه */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/shop/:category/:subcategory" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* سبد خرید و پرداخت */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="text-3xl font-bold">علاقه‌مندی‌ها (به زودی...)</h1>
            </div>
          } />
          
          {/* احراز هویت */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* پنل کاربری */}
          <Route path="/dashboard" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="text-3xl font-bold">پنل کاربری (به زودی...)</h1>
            </div>
          } />
          <Route path="/dashboard/orders" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="text-3xl font-bold">سفارشات من (به زودی...)</h1>
            </div>
          } />
          <Route path="/dashboard/wishlist" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="text-3xl font-bold">علاقه‌مندی‌های من (به زودی...)</h1>
            </div>
          } />
          
          {/* صفحات اطلاعاتی */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* راهنماها */}
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          
          {/* قوانین */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="text-3xl font-bold text-red-600">صفحه یافت نشد 404</h1>
              <p className="mt-4 text-gray-600">متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;