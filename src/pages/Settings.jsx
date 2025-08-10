import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../utils/constants';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Handle setting change
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Save settings
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    setHasChanges(false);
    toast.success('Settings saved successfully');
  };

  // Reset to defaults
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    toast('Settings reset to defaults', { icon: '🔄' });
  };

  // Handle logout
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
      navigate('/auth');
      toast.success('Logged out successfully');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'interface', label: 'Interface', icon: '🎨' },
    { id: 'voice', label: 'Voice', icon: '🎤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className="min-h-screen bg-willy-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-black/30 border border-willy-primary/20 text-willy-primary hover:bg-willy-primary/10 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-futuristic text-willy-primary">Settings</h1>
          </div>
          
          {hasChanges && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-black/30 border border-willy-primary/20 text-willy-primary/60 hover:text-willy-primary hover:bg-willy-primary/10 transition-all"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-willy-primary/20 border border-willy-primary text-willy-primary hover:bg-willy-primary/30 transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-willy-primary/20 rounded-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-willy-primary/20 border border-willy-primary text-willy-primary'
                        : 'hover:bg-willy-primary/10 text-willy-primary/60'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-tech">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* User Info */}
              <div className="mt-6 pt-6 border-t border-willy-primary/20">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-willy-primary/20 border border-willy-primary flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-willy-primary font-tech text-sm">
                    {user?.name || 'User'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 text-willy-error/60 hover:text-willy-error font-tech text-xs transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-willy-primary/20 rounded-xl p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-futuristic text-willy-primary mb-4">General Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-willy-primary/70 font-tech text-sm mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-4 py-2 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary font-tech focus:outline-none focus:border-willy-primary"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                        <option value="fr-FR">Français</option>
                        <option value="de-DE">Deutsch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-willy-primary/70 font-tech text-sm mb-2">
                        Performance Mode
                      </label>
                      <select
                        value={settings.performance}
                        onChange={(e) => handleSettingChange('performance', e.target.value)}
                        className="w-full px-4 py-2 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary font-tech focus:outline-none focus:border-willy-primary"
                      >
                        <option value="low">Low (Battery Saver)</option>
                        <option value="balanced">Balanced</option>
                        <option value="high">High Performance</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-willy-primary/70 font-tech text-sm">Auto-save</p>
                        <p className="text-willy-primary/40 font-tech text-xs">Automatically save your preferences</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.autoSave ? 'bg-willy-primary/30' : 'bg-black/30'
                        } border border-willy-primary/30`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-willy-primary transition-transform ${
                          settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Interface Settings */}
              {activeTab === 'interface' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-futuristic text-willy-primary mb-4">Interface Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-willy-primary/70 font-tech text-sm mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="w-full px-4 py-2 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary font-tech focus:outline-none focus:border-willy-primary"
                      >
                        <option value="dark">Dark (Default)</option>
                        <option value="midnight">Midnight Blue</option>
                        <option value="matrix">Matrix Green</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-willy-primary/70 font-tech text-sm">Sound Effects</p>
                        <p className="text-willy-primary/40 font-tech text-xs">UI interaction sounds</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('soundEffects', !settings.soundEffects)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.soundEffects ? 'bg-willy-primary/30' : 'bg-black/30'
                        } border border-willy-primary/30`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-willy-primary transition-transform ${
                          settings.soundEffects ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-willy-primary/70 font-tech text-sm">Notifications</p>
                        <p className="text-willy-primary/40 font-tech text-xs">System notifications</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', !settings.notifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.notifications ? 'bg-willy-primary/30' : 'bg-black/30'
                        } border border-willy-primary/30`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-willy-primary transition-transform ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Settings */}
              {activeTab === 'voice' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-futuristic text-willy-primary mb-4">Voice Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-willy-primary/70 font-tech text-sm">Voice Commands</p>
                        <p className="text-willy-primary/40 font-tech text-xs">Enable voice control</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('voiceEnabled', !settings.voiceEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.voiceEnabled ? 'bg-willy-primary/30' : 'bg-black/30'
                        } border border-willy-primary/30`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-willy-primary transition-transform ${
                          settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div>
                      <label className="block text-willy-primary/70 font-tech text-sm mb-2">
                        Wake Word
                      </label>
                      <input
                        type="text"
                        value="Hey WILLY"
                        disabled
                        className="w-full px-4 py-2 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary/50 font-tech"
                      />
                    </div>

                    <div>
                      <label className="block text-willy-primary/70 font-tech text-sm mb-2">
                        Voice Speed
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        defaultValue="1"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-futuristic text-willy-primary mb-4">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-willy-primary/70 font-tech text-sm">Biometric Authentication</p>
                        <p className="text-willy-primary/40 font-tech text-xs">Use Face ID / Touch ID</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('biometricEnabled', !settings.biometricEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.biometricEnabled ? 'bg-willy-primary/30' : 'bg-black/30'
                        } border border-willy-primary/30`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-willy-primary transition-transform ${
                          settings.biometricEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div>
                      <button className="w-full px-4 py-3 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary/70 hover:bg-willy-primary/10 hover:text-willy-primary transition-all font-tech">
                        Manage Trusted Devices
                      </button>
                    </div>

                    <div>
                      <button className="w-full px-4 py-3 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary/70 hover:bg-willy-primary/10 hover:text-willy-primary transition-all font-tech">
                        Export Data
                      </button>
                    </div>

                    <div>
                      <button className="w-full px-4 py-3 bg-willy-error/10 border border-willy-error/30 rounded-lg text-willy-error/70 hover:bg-willy-error/20 hover:text-willy-error transition-all font-tech">
                        Delete All Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* About */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-futuristic text-willy-primary mb-4">About WILLY</h2>
                  
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto mb-4 border-2 border-willy-primary rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-4xl font-futuristic text-willy-primary">W</span>
                      </div>
                      <h3 className="text-2xl font-futuristic text-willy-primary mb-2">WILLY Assistant</h3>
                      <p className="text-willy-primary/60 font-tech">Version 1.0.0</p>
                    </div>

                    <div className="space-y-2 text-center">
                      <p className="text-willy-primary/70 font-tech text-sm">
                        Your intelligent personal assistant
                      </p>
                      <p className="text-willy-primary/50 font-tech text-xs">
                        Powered by advanced AI and futuristic technology
                      </p>
                    </div>

                    <div className="pt-4 space-y-2">
                      <button className="w-full px-4 py-2 text-willy-primary/60 hover:text-willy-primary font-tech text-sm transition-colors">
                        Documentation
                      </button>
                      <button className="w-full px-4 py-2 text-willy-primary/60 hover:text-willy-primary font-tech text-sm transition-colors">
                        Privacy Policy
                      </button>
                      <button className="w-full px-4 py-2 text-willy-primary/60 hover:text-willy-primary font-tech text-sm transition-colors">
                        Terms of Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;