'use client'

import React, { useId } from 'react'

interface InputProps {
  id?: string
  type: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  error?: string | null
  label?: string
}

export default function Input({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error = null,
  label
}: InputProps) {
  const defaultId = useId()
  const inputId = id || defaultId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="w-full space-y-2">
      {label && (
        <label 
          id="input-label"
          htmlFor={inputId}
          className="block text-sm font-medium text-[rgb(var(--foreground))] transition-colors"
        >
          {label}
          {required && (
            <span 
              id="input-required-indicator"
              className="ml-1 text-[rgb(var(--error))]"
            >
              *
            </span>
          )}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={`
            block w-full rounded-[var(--radius)] border px-3 py-2.5 text-sm
            bg-white text-[rgb(var(--foreground))]
            placeholder:text-gray-500
            transition-all duration-200 ease-in-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50
            ${error 
              ? 'border-[rgb(var(--error))] focus-visible:ring-[rgb(var(--error))]' 
              : 'border-[rgb(var(--border))] hover:border-gray-400 focus-visible:border-[rgb(var(--ring))]'
            }
          `}
        />
        
        {type === 'password' && value && (
          <div 
            id="input-password-strength-indicator"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <div className={`
              w-2 h-2 rounded-full transition-colors duration-200
              ${value.length >= 8 
                ? 'bg-[rgb(var(--success))]' 
                : value.length >= 4 
                  ? 'bg-[rgb(var(--secondary))]' 
                  : 'bg-[rgb(var(--error))]'
              }
            `} />
          </div>
        )}
      </div>

      {error && (
        <div 
          id="input-error-message"
          className="flex items-center space-x-1 text-sm text-[rgb(var(--error))] animate-in slide-in-from-top-1 duration-200"
        >
          <svg 
            id="input-error-icon"
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span id="input-error-text">{error}</span>
        </div>
      )}

      {type === 'email' && value && !error && (
        <div 
          id="input-email-validation"
          className="flex items-center space-x-1 text-sm text-[rgb(var(--success))] animate-in slide-in-from-top-1 duration-200"
        >
          <svg 
            id="input-success-icon"
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span id="input-email-valid-text">Valid email format</span>
        </div>
      )}
    </div>
  )
}