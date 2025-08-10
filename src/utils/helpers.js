// Utility Helper Functions

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Format date
export const formatDate = (date, format = 'default') => {
  const d = new Date(date);
  
  const formats = {
    default: { dateStyle: 'medium', timeStyle: 'short' },
    long: { dateStyle: 'long', timeStyle: 'medium' },
    short: { dateStyle: 'short', timeStyle: 'short' },
    date: { dateStyle: 'medium' },
    time: { timeStyle: 'medium' }
  };
  
  return new Intl.DateTimeFormat('en-US', formats[format] || formats.default).format(d);
};

// Format relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date, 'short');
};

// Format bytes
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Generate unique ID
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Sleep function
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
};

// Clamp value
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

// Random integer
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random from array
export const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Shuffle array
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

// Merge objects deeply
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

// Check if object
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Check if empty
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate string
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

// Parse query string
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

// Build query string
export const buildQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

// Get cookie
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Set cookie
export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Delete cookie
export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

// Check if mobile device
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if iOS
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Check if PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
};

// Vibrate device
export const vibrate = (pattern = 200) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Download file
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// Get browser info
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  
  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Safari';
  else if (ua.indexOf('Edge') > -1) browser = 'Edge';
  
  return {
    browser,
    version: navigator.appVersion,
    platform: navigator.platform,
    language: navigator.language
  };
};

// Export all helpers
export default {
  debounce,
  throttle,
  formatDate,
  formatRelativeTime,
  formatBytes,
  generateId,
  sleep,
  retry,
  clamp,
  randomInt,
  randomFromArray,
  shuffleArray,
  deepClone,
  deepMerge,
  isObject,
  isEmpty,
  capitalize,
  truncate,
  parseQueryString,
  buildQueryString,
  getCookie,
  setCookie,
  deleteCookie,
  isMobile,
  isIOS,
  isPWA,
  vibrate,
  copyToClipboard,
  downloadFile,
  getBrowserInfo
};