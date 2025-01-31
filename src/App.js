// src/App.js
import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import FuelRecords from './pages/FuelRecords';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext';
import Toast from './components/Toast';
import { ToastContext } from './contexts/ToastContext';
import './App.css';

function App() {
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <AuthProvider>
            <ToastContext.Provider value={{ showToast }}>
                <Router>
                    <div className="min-h-screen bg-gray-100">
                        <Navigation />
                        <div className="container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/fuel" element={<FuelRecords />} />
                                <Route path="/maintenance" element={<Maintenance />} />
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </div>
                    </div>
                    {toast && <Toast message={toast.message} type={toast.type} />}
                </Router>
            </ToastContext.Provider>
        </AuthProvider>
    );
}

export default App;
