import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import FuelRecords from './pages/FuelRecords';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Toast from './components/Toast';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
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
                        <Toast />
                    </div>
                </Router>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;