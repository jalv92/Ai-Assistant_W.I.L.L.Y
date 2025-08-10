import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const BiometricAuth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [supportsBiometric, setSupportsBiometric] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { login, register, checkWebAuthnSupport } = useAuth();

  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = await checkWebAuthnSupport();
      setSupportsBiometric(isSupported);
      
      if (!isSupported) {
        toast.error('Biometric authentication not supported on this device');
      }
    };
    
    checkSupport();
  }, []);

  const handleRegistration = async () => {
    if (!username) {
      toast.error('Please enter a username');
      return;
    }

    setIsRegistering(true);
    
    try {
      // Generate registration options from server (mock for now)
      const registrationOptions = {
        challenge: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))),
        rp: {
          name: 'WILLY Assistant',
          id: window.location.hostname
        },
        user: {
          id: btoa(username),
          name: username,
          displayName: username
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' }
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        },
        timeout: 60000,
        attestation: 'direct'
      };

      const credential = await startRegistration(registrationOptions);
      
      if (credential) {
        await register(username, credential);
        toast.success('Registration successful! You can now login with Face ID');
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    
    try {
      // Generate authentication options from server (mock for now)
      const authenticationOptions = {
        challenge: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))),
        timeout: 60000,
        userVerification: 'required',
        rpId: window.location.hostname
      };

      const credential = await startAuthentication(authenticationOptions);
      
      if (credential) {
        const success = await login(credential);
        if (success) {
          toast.success('Authentication successful!');
          navigate('/');
        } else {
          toast.error('Authentication failed');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleBypassAuth = () => {
    // Development bypass
    localStorage.setItem('willy_auth', 'bypass');
    toast.success('Development mode - Authentication bypassed');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-willy-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/50 backdrop-blur-xl border border-willy-primary/30 rounded-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-willy-primary rounded-full flex items-center justify-center animate-pulse">
                <span className="text-willy-primary font-futuristic text-4xl">W</span>
              </div>
              <div className="absolute inset-0 animate-glow rounded-full"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-futuristic text-willy-primary text-center mb-2">
            WILLY ASSISTANT
          </h1>
          <p className="text-willy-primary/60 text-center font-tech text-sm mb-8">
            Secure Biometric Authentication
          </p>

          {/* Authentication Options */}
          {supportsBiometric ? (
            <div className="space-y-4">
              {!isRegistering ? (
                <>
                  {/* Login Button */}
                  <button
                    onClick={handleAuthentication}
                    disabled={isAuthenticating}
                    className="w-full py-4 bg-willy-primary/10 border border-willy-primary rounded-lg hover:bg-willy-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-6 h-6 text-willy-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <span className="text-willy-primary font-tech">
                        {isAuthenticating ? 'Authenticating...' : 'Login with Face ID'}
                      </span>
                    </div>
                  </button>

                  {/* Register Link */}
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="w-full py-2 text-willy-primary/60 hover:text-willy-primary font-tech text-sm transition-colors"
                  >
                    New user? Register Face ID
                  </button>
                </>
              ) : (
                <>
                  {/* Registration Form */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-willy-primary/30 rounded-lg text-willy-primary placeholder-willy-primary/30 font-tech focus:outline-none focus:border-willy-primary"
                    />
                    
                    <button
                      onClick={handleRegistration}
                      disabled={!username || isRegistering}
                      className="w-full py-4 bg-willy-primary/10 border border-willy-primary rounded-lg hover:bg-willy-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-willy-primary font-tech">
                        {isRegistering ? 'Registering...' : 'Register Face ID'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setIsRegistering(false)}
                      className="w-full py-2 text-willy-primary/60 hover:text-willy-primary font-tech text-sm transition-colors"
                    >
                      Back to login
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-willy-error/10 border border-willy-error/30 rounded-lg p-4">
                <p className="text-willy-error font-tech text-sm text-center">
                  Biometric authentication not available
                </p>
              </div>
              
              <button
                onClick={handleBypassAuth}
                className="w-full py-4 bg-willy-primary/10 border border-willy-primary rounded-lg hover:bg-willy-primary/20 transition-all duration-300"
              >
                <span className="text-willy-primary font-tech">
                  Continue without authentication (Dev Mode)
                </span>
              </button>
            </div>
          )}

          {/* Security Badge */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-willy-success rounded-full animate-pulse"></div>
              <span className="text-willy-success/60 font-tech text-xs">
                Secure Connection
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BiometricAuth;