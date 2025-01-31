import React, { createContext, useState, useCallback, useContext } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'info'
    });

    const showToast = useCallback((message, type = 'info') => {
        setToast({
            visible: true,
            message,
            type
        });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};