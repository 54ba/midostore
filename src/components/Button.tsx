'use client'

import { useId } from 'react'

interface ButtonProps {
  id?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  id,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button'
}: ButtonProps) {
  const defaultId = useId()
  const buttonId = id || defaultId

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-teal-700 active:bg-teal-800'
      case 'secondary':
        return 'bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] hover:bg-amber-600 active:bg-amber-700'
      case 'danger':
        return 'bg-[rgb(var(--error))] text-white hover:bg-red-600 active:bg-red-700'
      case 'outline':
        return 'border-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))] bg-transparent hover:bg-[rgb(var(--primary))] hover:text-[rgb(var(--primary-foreground))] active:bg-teal-700'
      default:
        return 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-teal-700 active:bg-teal-800'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm h-8'
      case 'md':
        return 'px-4 py-2 text-sm h-10'
      case 'lg':
        return 'px-6 py-3 text-base h-12'
      default:
        return 'px-4 py-2 text-sm h-10'
    }
  }

  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] font-medium ring-offset-[rgb(var(--background))] transition-all duration-200 transform'
  const focusClasses = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2'
  const disabledClasses = 'disabled:pointer-events-none disabled:opacity-50'
  const hoverClasses = 'hover:scale-[1.02] active:scale-[0.98]'

  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()

  return (
    <button
      id={buttonId}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${focusClasses} ${disabledClasses} ${!disabled && !loading ? hoverClasses : ''}`}
    >
      {loading && (
        <div className="mr-2 flex items-center">
          <div 
            id="button-loading-spinner"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        </div>
      )}
      <span id="button-content" className={loading ? 'opacity-75' : ''}>
        {children}
      </span>
    </button>
  )
}