const jwt = require('jsonwebtoken');

/**
 * ایجاد JWT Token برای احراز هویت
 * @param {String} id - شناسه کاربر
 * @returns {String} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * ایجاد Refresh Token
 * @param {String} id - شناسه کاربر
 * @returns {String} - Refresh Token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d' // 3 ماه
  });
};

/**
 * تایید Token
 * @param {String} token - JWT Token
 * @returns {Object} - دیتای decode شده یا null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken
};