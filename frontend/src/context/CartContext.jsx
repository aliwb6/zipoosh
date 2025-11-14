import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // بارگذاری از localStorage
    const savedCart = localStorage.getItem('zipoosh_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ذخیره در localStorage هر بار که سبد تغییر کنه
  useEffect(() => {
    localStorage.setItem('zipoosh_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // افزودن محصول به سبد
  const addToCart = (product, size, color, quantity = 1) => {
    setCartItems(prevItems => {
      // چک کنیم همین محصول با همین سایز و رنگ وجود داره؟
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        // اگه وجود داره، تعداد رو اضافه کن
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // اگه نداره، محصول جدید اضافه کن
        return [...prevItems, {
          ...product,
          size,
          color,
          quantity,
          cartId: `${product.id}-${size}-${color}-${Date.now()}`
        }];
      }
    });
  };

  // حذف محصول از سبد
  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  // آپدیت تعداد محصول
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // خالی کردن سبد
  const clearCart = () => {
    setCartItems([]);
  };

  // محاسبه جمع کل
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // تعداد کل آیتم‌های سبد
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // چک کردن اینکه محصول در سبد هست یا نه
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};