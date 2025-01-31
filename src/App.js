// src/App.js
import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { AuthProvider } from './context/authContext';
import Toast from './components/Toast';
import './styles/global.css';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import CarManagement from './pages/CarManagement';

export const ToastContext = React.createContext(null);

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/expenses", element: <Expenses /> },
      { path: "/maintenance", element: <Maintenance /> },
      { path: "/fuel", element: <Fuel /> },
      { path: "/analytics", element: <Analytics /> },
      { path: "/settings", element: <Settings /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/cars", element: <CarManagement /> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

// Layout component to wrap the Navbar and content
function Layout() {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Outlet />
      </div>
    </>
  );
}

const App = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <AuthProvider>
      <ToastContext.Provider value={{ showToast }}>
        <RouterProvider router={router} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </ToastContext.Provider>
    </AuthProvider>
  );
};

export default App;
