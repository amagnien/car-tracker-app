import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast ${type}`}>
      <span className="message">{message}</span>
      <button className="close-button" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast; 