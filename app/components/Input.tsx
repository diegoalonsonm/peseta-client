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
    step
}: InputProps) => {

    // Determine validation class
    let validationClass = ''
    if (error) {
        validationClass = 'is-invalid'
    } else if (isValid && value) {
        validationClass = 'is-valid'
    }

    return (
        <div className="position-relative">
            <input
                type={type}
                className={`form-control ${validationClass} ${className}`}
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
                <>
                    <div className="invalid-feedback-icon">
                        <IconAlertCircle size={20} />
                    </div>
                    <div className="invalid-feedback d-block">
                        {error}
                    </div>
                </>
            )}
        </div>
    )
}
