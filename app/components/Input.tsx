import { InputProps } from '@/types'
import React from 'react'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'

export const Input = ({
    type,
    className = '',
    id,
    ariaDescribedby,
    onChange,
    value,
    placeholder,
    required = false,
    error,
    isValid,
    disabled = false,
    min,
    step,
    icon,
    helperText,
    floatingLabel = false,
    label
}: InputProps) => {

    // Determine validation class
    let validationClass = ''
    if (error) {
        validationClass = 'is-invalid'
    } else if (isValid && value) {
        validationClass = 'is-valid'
    }

    const hasIcon = !!icon

    // Floating label variant
    if (floatingLabel) {
        return (
            <div className="form-floating-wrapper">
                <div className={`position-relative ${hasIcon ? 'has-icon' : ''}`}>
                    {icon && <div className="input-icon-prefix">{icon}</div>}
                    <div className="form-floating">
                        <input
                            type={type}
                            className={`form-control ${validationClass} ${className} ${hasIcon ? 'with-icon' : ''}`}
                            id={id}
                            aria-describedby={ariaDescribedby}
                            onChange={onChange}
                            value={value}
                            placeholder={placeholder || ' '}
                            required={required}
                            disabled={disabled}
                            min={min}
                            step={step}
                        />
                        {label && (
                            <label htmlFor={id}>{label}{required && ' *'}</label>
                        )}
                    </div>
                    {isValid && value && !error && (
                        <div className="valid-feedback-icon">
                            <IconCheck size={20} />
                        </div>
                    )}
                    {error && (
                        <div className="invalid-feedback-icon">
                            <IconAlertCircle size={20} />
                        </div>
                    )}
                </div>
                {error && (
                    <div className="invalid-feedback d-block mt-1">
                        {error}
                    </div>
                )}
                {helperText && !error && (
                    <div className="form-helper-text">
                        {helperText}
                    </div>
                )}
            </div>
        )
    }

    // Standard variant
    return (
        <div className="input-wrapper">
            <div className={`position-relative ${hasIcon ? 'has-icon' : ''}`}>
                {icon && <div className="input-icon-prefix">{icon}</div>}
                <input
                    type={type}
                    className={`form-control ${validationClass} ${className} ${hasIcon ? 'with-icon' : ''}`}
                    id={id}
                    aria-describedby={ariaDescribedby}
                    onChange={onChange}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    min={min}
                    step={step}
                />
                {isValid && value && !error && (
                    <div className="valid-feedback-icon">
                        <IconCheck size={20} />
                    </div>
                )}
                {error && (
                    <div className="invalid-feedback-icon">
                        <IconAlertCircle size={20} />
                    </div>
                )}
            </div>
            {error && (
                <div className="invalid-feedback d-block mt-1">
                    {error}
                </div>
            )}
            {helperText && !error && (
                <div className="form-helper-text">
                    {helperText}
                </div>
            )}
        </div>
    )
}
