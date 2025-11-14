import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { APP_NAME } from '../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // پاک کردن خطا هنگام تایپ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'نام و نام خانوادگی الزامی است';
    } else if (formData.name.length < 3) {
      newErrors.name = 'نام باید حداقل 3 کاراکتر باشد';
    }

    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    if (!formData.phone) {
      newErrors.phone = 'شماره موبایل الزامی است';
    } else if (!/^09[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'شماره موبایل معتبر نیست (مثال: 09123456789)';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';
    }

    if (!acceptTerms) {
      newErrors.terms = 'پذیرش شرایط و قوانین الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setGeneralError(result.message || 'خطا در ثبت‌نام');
      }
    } catch (error) {
      setGeneralError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">ز</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            عضویت در {APP_NAME}
          </h1>
          <p className="text-gray-600">
            با ثبت‌نام، از تخفیف‌ها و پیشنهادات ویژه باخبر شوید
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* General Error */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{generalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <Input
              label="نام و نام خانوادگی"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="نام کامل خود را وارد کنید"
              icon={User}
              error={errors.name}
              required
            />

            {/* Email */}
            <Input
              label="ایمیل"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              icon={Mail}
              error={errors.email}
              required
            />

            {/* Phone */}
            <Input
              label="شماره موبایل"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09123456789"
              icon={Phone}
              error={errors.phone}
              required
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="رمز عبور"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="حداقل 6 کاراکتر"
                icon={Lock}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="تکرار رمز عبور"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="رمز عبور را دوباره وارد کنید"
                icon={Lock}
                error={errors.confirmPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                    شرایط و قوانین
                  </Link>
                  {' '}و{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                    حریم خصوصی
                  </Link>
                  {' '}را مطالعه کرده و می‌پذیرم
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              ثبت‌نام و ایجاد حساب
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">یا</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowRight size={20} />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;