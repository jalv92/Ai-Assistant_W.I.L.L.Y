// Validation Functions

import { PATTERNS } from './constants';

// Validate email
export const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };
  if (!PATTERNS.EMAIL.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
};

// Validate username
export const validateUsername = (username) => {
  if (!username) return { valid: false, error: 'Username is required' };
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (username.length > 20) {
    return { valid: false, error: 'Username must be less than 20 characters' };
  }
  if (!PATTERNS.USERNAME.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, _ and -' };
  }
  return { valid: true };
};

// Validate password
export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!PATTERNS.PASSWORD.test(password)) {
    return { 
      valid: false, 
      error: 'Password must contain uppercase, lowercase, and number' 
    };
  }
  return { valid: true };
};

// Validate URL
export const validateURL = (url) => {
  if (!url) return { valid: false, error: 'URL is required' };
  if (!PATTERNS.URL.test(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  return { valid: true };
};

// Validate command
export const validateCommand = (command) => {
  if (!command) return { valid: false, error: 'Command is required' };
  if (command.length < 1) {
    return { valid: false, error: 'Command cannot be empty' };
  }
  if (command.length > 200) {
    return { valid: false, error: 'Command is too long' };
  }
  if (!PATTERNS.COMMAND.test(command)) {
    return { valid: false, error: 'Command contains invalid characters' };
  }
  return { valid: true };
};

// Validate phone number
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phone) return { valid: false, error: 'Phone number is required' };
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  return { valid: true };
};

// Validate date
export const validateDate = (date, options = {}) => {
  const { minDate, maxDate, required = true } = options;
  
  if (!date && required) {
    return { valid: false, error: 'Date is required' };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (minDate && dateObj < new Date(minDate)) {
    return { valid: false, error: `Date must be after ${minDate}` };
  }
  
  if (maxDate && dateObj > new Date(maxDate)) {
    return { valid: false, error: `Date must be before ${maxDate}` };
  }
  
  return { valid: true };
};

// Validate number
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false, required = true } = options;
  
  if (value === null || value === undefined || value === '') {
    if (required) {
      return { valid: false, error: 'Value is required' };
    }
    return { valid: true };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { valid: false, error: 'Must be an integer' };
  }
  
  if (min !== undefined && num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { valid: false, error: `Must be at most ${max}` };
  }
  
  return { valid: true };
};

// Validate array
export const validateArray = (arr, options = {}) => {
  const { minLength = 0, maxLength, required = true } = options;
  
  if (!arr || !Array.isArray(arr)) {
    if (required) {
      return { valid: false, error: 'Array is required' };
    }
    return { valid: true };
  }
  
  if (arr.length < minLength) {
    return { valid: false, error: `Must have at least ${minLength} items` };
  }
  
  if (maxLength && arr.length > maxLength) {
    return { valid: false, error: `Must have at most ${maxLength} items` };
  }
  
  return { valid: true };
};

// Validate file
export const validateFile = (file, options = {}) => {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    required = true 
  } = options;
  
  if (!file) {
    if (required) {
      return { valid: false, error: 'File is required' };
    }
    return { valid: true };
  }
  
  if (file.size > maxSize) {
    const sizeMB = (maxSize / 1024 / 1024).toFixed(1);
    return { valid: false, error: `File size must be less than ${sizeMB}MB` };
  }
  
  if (allowedTypes.length > 0) {
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    const isValidType = allowedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return fileType.startsWith(baseType);
      }
      return fileType === type || fileExtension === type.replace('.', '');
    });
    
    if (!isValidType) {
      return { 
        valid: false, 
        error: `File type must be: ${allowedTypes.join(', ')}` 
      };
    }
  }
  
  return { valid: true };
};

// Validate credit card
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) return { valid: false, error: 'Card number is required' };
  
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, error: 'Card number must contain only digits' };
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { valid: false, error: 'Invalid card number length' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { valid: false, error: 'Invalid card number' };
  }
  
  return { valid: true };
};

// Validate form
export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    
    for (const rule of rules) {
      const result = rule(value);
      
      if (!result.valid) {
        errors[field] = result.error;
        isValid = false;
        break;
      }
    }
  }
  
  return { isValid, errors };
};

// Custom validator builder
export const createValidator = (validationFn, errorMessage) => {
  return (value) => {
    const isValid = validationFn(value);
    return isValid ? { valid: true } : { valid: false, error: errorMessage };
  };
};

// Common validators
export const required = createValidator(
  value => value !== null && value !== undefined && value !== '',
  'This field is required'
);

export const minLength = (min) => createValidator(
  value => !value || value.length >= min,
  `Must be at least ${min} characters`
);

export const maxLength = (max) => createValidator(
  value => !value || value.length <= max,
  `Must be at most ${max} characters`
);

export const pattern = (regex, message) => createValidator(
  value => !value || regex.test(value),
  message || 'Invalid format'
);

// Export all validators
export default {
  validateEmail,
  validateUsername,
  validatePassword,
  validateURL,
  validateCommand,
  validatePhone,
  validateDate,
  validateNumber,
  validateArray,
  validateFile,
  validateCreditCard,
  validateForm,
  createValidator,
  required,
  minLength,
  maxLength,
  pattern
};