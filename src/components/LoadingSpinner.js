import React from 'react';
import './styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner; 