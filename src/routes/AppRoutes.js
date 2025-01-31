import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CarManagement from '../pages/CarManagement';
import Analytics from '../pages/Analytics';
import NotFound from '../pages/NotFound';
import { ToastProvider } from '../contexts/ToastContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <ToastProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/cars" element={
                    <PrivateRoute>
                        <CarManagement />
                    </PrivateRoute>
                } />
                <Route path="/analytics" element={
                    <PrivateRoute>
                        <Analytics />
                    </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ToastProvider>
    );
};

export default AppRoutes; 