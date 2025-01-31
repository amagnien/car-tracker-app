// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AppRoutes from './routes/AppRoutes';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import './App.css';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <div className="app">
                        <Navigation />
                        <main className="main-content">
                            <AppRoutes />
                        </main>
                        <Toast />
                    </div>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
