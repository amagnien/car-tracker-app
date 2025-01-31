import React, { useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import './styles/Toast.css';

const Toast = () => {
    const { toast, hideToast } = useToast();

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                hideToast();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [toast.visible, hideToast]);

    if (!toast.visible) return null;

    return (
        <div className={`toast toast-${toast.type}`}>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={hideToast}>×</button>
        </div>
    );
};

export default Toast; 