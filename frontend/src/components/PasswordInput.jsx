import { useState } from 'react';

const PasswordInput = ({
    label,
    value,
    onChange,
    placeholder = 'Enter password',
    required = false,
    id,
    name,
    error,
    helperText,
    disabled = false,
    className = '',
    autoComplete = 'current-password'
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || name || 'password-input';

    return (
        <div className={`mb-3 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="form-label fw-semibold text-secondary small mb-1">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}
            <div className="input-group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                    onClick={() => setShowPassword(prev => !prev)}
                    disabled={disabled}
                    tabIndex="-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    style={{ minWidth: '42px' }}
                >
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
            </div>
            {error && <div className="text-danger small mt-1">{error}</div>}
            {helperText && !error && <div className="text-muted small mt-1">{helperText}</div>}
        </div>
    );
};

export default PasswordInput;
