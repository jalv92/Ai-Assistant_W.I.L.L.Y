import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Settings from './pages/Settings';
import BiometricAuth from './components/auth/BiometricAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'auth',
        element: <BiometricAuth />
      }
    ]
  }
]);