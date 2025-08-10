import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import BiometricAuth from './components/auth/BiometricAuth';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-willy-gradient flex items-center justify-center">
    <div className="relative">
      <div className="w-32 h-32 border-4 border-willy-primary rounded-full animate-pulse"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-willy-primary font-futuristic text-2xl animate-flicker">W</span>
      </div>
    </div>
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
      <p className="text-willy-primary font-tech text-sm animate-pulse">Initializing WILLY...</p>
    </div>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      await checkAuth();
      setTimeout(() => setIsInitialized(true), 1000);
    };
    
    initializeApp();
  }, [checkAuth]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-willy-gradient overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(26, 26, 46, 0.95)',
            color: '#00ffff',
            border: '1px solid #00ffff',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#00ff00',
              secondary: '#0a0a0a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff0000',
              secondary: '#0a0a0a',
            },
          },
        }}
      />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/auth" element={
            isAuthenticated ? <Navigate to="/" replace /> : <BiometricAuth />
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;