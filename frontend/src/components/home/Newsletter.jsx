import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-white mb-8">
          <Mail size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">عضویت در خبرنامه</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            از جدیدترین محصولات و تخفیف های ویژه باخبر شوید
          </p>
        </div>

        {subscribed ? (
          <div className="max-w-md mx-auto bg-green-500 text-white px-6 py-4 rounded-lg text-center">
            ✅ با موفقیت عضو خبرنامه شدید
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید"
                required
                className="flex-1 px-4 py-3 rounded-lg outline-none text-gray-900"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <Send size={20} />
                عضویت
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;