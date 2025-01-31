// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
        <Router>
          <Navbar />
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fuel" element={<Fuel />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/cars" element={<CarManagement />} />
            </Routes>
          </div>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
            />
          )}
        </Router>
      </ToastContext.Provider>
    </AuthProvider>
  );
};

export default App;
