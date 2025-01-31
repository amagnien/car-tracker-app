// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AppRoutes from './routes/AppRoutes';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import './App.css';

// Lazy load components that aren't immediately needed
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CarManagement = React.lazy(() => import('./pages/CarManagement'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <div className="app">
                        <Navigation />
                        <main className="main-content">
                            <Suspense fallback={<div>Loading...</div>}>
                                <AppRoutes />
                            </Suspense>
                        </main>
                        <Toast />
                    </div>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
