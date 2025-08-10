// Application Constants
export const APP_CONFIG = {
  NAME: 'WILLY',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your intelligent personal assistant',
  AUTHOR: 'WILLY Team',
  SUPPORT_EMAIL: 'support@willy.ai'
};

// Color Palette
export const COLORS = {
  PRIMARY: '#00ffff',
  SECONDARY: '#0080ff',
  SUCCESS: '#00ff00',
  ERROR: '#ff0000',
  WARNING: '#ffaa00',
  DARK: '#0a0a0a',
  DARKER: '#1a1a2e',
  LIGHT: '#ffffff',
  GRAY: {
    100: '#f0f0f0',
    200: '#e0e0e0',
    300: '#c0c0c0',
    400: '#a0a0a0',
    500: '#808080',
    600: '#606060',
    700: '#404040',
    800: '#202020',
    900: '#101010'
  }
};

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  AUTH: '/auth',
  USER: '/user',
  COMMANDS: '/commands',
  WEBHOOK: '/webhook',
  VOICE: '/voice'
};

// Voice Commands
export const VOICE_COMMANDS = {
  WAKE_WORDS: ['hey willy', 'ok willy', 'willy'],
  SYSTEM: ['status', 'report', 'scan', 'check', 'diagnostic'],
  CONTROL: ['activate', 'deactivate', 'enable', 'disable', 'turn on', 'turn off'],
  NAVIGATION: ['open', 'close', 'show', 'hide', 'go to', 'navigate'],
  QUERY: ['what', 'how', 'when', 'where', 'why', 'who'],
  CONFIRMATION: ['yes', 'no', 'confirm', 'cancel', 'accept', 'reject']
};

// System Status
export const SYSTEM_STATUS = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  PROCESSING: 'processing',
  LISTENING: 'listening',
  ERROR: 'error',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance'
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network connection error. Please check your internet connection.',
  AUTH: 'Authentication failed. Please login again.',
  PERMISSION: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  TIMEOUT: 'Request timed out. Please try again.',
  VOICE_NOT_SUPPORTED: 'Voice recognition is not supported on this device.',
  BIOMETRIC_NOT_SUPPORTED: 'Biometric authentication is not supported on this device.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out.',
  COMMAND_EXECUTED: 'Command executed successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.'
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'willy_auth_token',
  USER_DATA: 'willy_user_data',
  SETTINGS: 'willy_settings',
  THEME: 'willy_theme',
  LANGUAGE: 'willy_language',
  VOICE_ENABLED: 'willy_voice_enabled',
  BIOMETRIC_ENABLED: 'willy_biometric_enabled'
};

// Feature Flags
export const FEATURES = {
  VOICE_COMMANDS: import.meta.env.VITE_ENABLE_VOICE === 'true',
  BIOMETRIC_AUTH: import.meta.env.VITE_ENABLE_BIOMETRIC === 'true',
  THREE_D_GRAPHICS: import.meta.env.VITE_ENABLE_3D === 'true',
  PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  OFFLINE_MODE: true,
  DARK_MODE: true,
  NOTIFICATIONS: true
};

// Performance Thresholds
export const PERFORMANCE = {
  MAX_FPS: 60,
  MIN_FPS: 30,
  MAX_MEMORY_MB: 500,
  MAX_LOAD_TIME_MS: 3000,
  MAX_API_TIMEOUT_MS: 30000
};

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  COMMAND: /^[a-zA-Z0-9\s-_]+$/
};

// Default Settings
export const DEFAULT_SETTINGS = {
  theme: 'dark',
  language: 'en-US',
  voiceEnabled: true,
  biometricEnabled: false,
  notifications: true,
  soundEffects: true,
  autoSave: true,
  performance: 'balanced'
};

// Command Categories
export const COMMAND_CATEGORIES = {
  SYSTEM: 'system',
  AUTOMATION: 'automation',
  QUERY: 'query',
  CONTROL: 'control',
  NAVIGATION: 'navigation',
  UTILITY: 'utility'
};

// Rate Limits
export const RATE_LIMITS = {
  COMMANDS_PER_MINUTE: 30,
  API_CALLS_PER_MINUTE: 60,
  VOICE_COMMANDS_PER_MINUTE: 20,
  MAX_RETRY_ATTEMPTS: 3
};

// Export all constants
export default {
  APP_CONFIG,
  COLORS,
  ANIMATIONS,
  BREAKPOINTS,
  API_ENDPOINTS,
  VOICE_COMMANDS,
  SYSTEM_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  FEATURES,
  PERFORMANCE,
  PATTERNS,
  DEFAULT_SETTINGS,
  COMMAND_CATEGORIES,
  RATE_LIMITS
};