import { useState, useCallback, useEffect } from 'react';
import { authenticateWithBiometric, registerBiometric } from '../services/webauthn/biometric';
import { supabase } from '../services/supabase/client';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Check for development bypass
      if (localStorage.getItem('willy_auth') === 'bypass') {
        setIsAuthenticated(true);
        setUser({ id: 'dev-user', name: 'Developer' });
        setIsLoading(false);
        return;
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
      } else {
        // Check for stored credentials
        const storedAuth = localStorage.getItem('willy_biometric_auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          setIsAuthenticated(true);
          setUser(authData.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkWebAuthnSupport = useCallback(async () => {
    try {
      if (!window.PublicKeyCredential) {
        return false;
      }
      
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('WebAuthn support check failed:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (username, credential) => {
    try {
      // Store credential for demo purposes
      const authData = {
        user: { id: credential.id, name: username },
        credential: credential.id,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('willy_biometric_auth', JSON.stringify(authData));
      localStorage.setItem('willy_registered_user', username);
      
      // In production, send to backend
      // await supabase.auth.signUp({ ... })
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }, []);

  const login = useCallback(async (credential) => {
    try {
      // Verify stored credential for demo
      const storedAuth = localStorage.getItem('willy_biometric_auth');
      
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(authData.user);
        return true;
      }
      
      // In production, verify with backend
      // const { data, error } = await supabase.auth.signInWithOAuth({ ... })
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear all auth data
      localStorage.removeItem('willy_auth');
      localStorage.removeItem('willy_biometric_auth');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      setIsAuthenticated(false);
      setUser(null);
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    checkAuth,
    checkWebAuthnSupport,
    register,
    login,
    logout,
    refreshSession
  };
};