import React from 'react';
import { useToast } from '../contexts/ToastContext';
import './styles/Toast.css';

const Toast = () => {
    const { toast } = useToast();

    if (!toast.show) return null;

    return (
        <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
            {toast.message}
        </div>
    );
};

export default Toast; 