import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

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
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({
            ...prev,
            visible: false
        }));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
}; 