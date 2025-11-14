import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // بررسی لاگین بودن کاربر هنگام بارگذاری
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await axios.get(`${API_URL}/auth/me`);
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ثبت‌نام
  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ثبت‌نام' 
      };
    }
  };

  // ورود
  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ورود' 
      };
    }
  };

  // خروج
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // به‌روزرسانی پروفایل
  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put(`${API_URL}/auth/profile`, userData);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل' 
      };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};