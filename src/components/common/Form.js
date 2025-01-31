import React from 'react';
import './styles/Form.css';

export const FormGroup = ({ children, className = '' }) => (
    <div className={`form-group ${className}`}>
        {children}
    </div>
);

export const FormRow = ({ children, className = '' }) => (
    <div className={`form-row ${className}`}>
        {children}
    </div>
);

export const FormLabel = ({ children, htmlFor, required }) => (
    <label htmlFor={htmlFor} className="form-label">
        {children}
        {required && <span className="required-mark">*</span>}
    </label>
);

export const FormInput = React.forwardRef(({ className = '', error, ...props }, ref) => (
    <div className="form-input-container">
        <input
            ref={ref}
            className={`form-input ${error ? 'has-error' : ''} ${className}`}
            {...props}
        />
        {error && <span className="form-error">{error}</span>}
    </div>
));

export const FormSelect = React.forwardRef(({ children, className = '', error, ...props }, ref) => (
    <div className="form-input-container">
        <select
            ref={ref}
            className={`form-select ${error ? 'has-error' : ''} ${className}`}
            {...props}
        >
            {children}
        </select>
        {error && <span className="form-error">{error}</span>}
    </div>
));

export const FormTextarea = React.forwardRef(({ className = '', error, ...props }, ref) => (
    <div className="form-input-container">
        <textarea
            ref={ref}
            className={`form-textarea ${error ? 'has-error' : ''} ${className}`}
            {...props}
        />
        {error && <span className="form-error">{error}</span>}
    </div>
));

export const FormButton = ({ children, variant = 'primary', className = '', loading, ...props }) => (
    <button
        className={`form-button button-${variant} ${loading ? 'loading' : ''} ${className}`}
        disabled={loading}
        {...props}
    >
        {loading ? (
            <>
                <span className="loading-spinner"></span>
                <span>Loading...</span>
            </>
        ) : children}
    </button>
);

export const FormCard = ({ children, title, className = '' }) => (
    <div className={`form-card ${className}`}>
        {title && <h2 className="form-card-title">{title}</h2>}
        {children}
    </div>
); 