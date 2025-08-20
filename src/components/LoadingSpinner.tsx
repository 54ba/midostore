'use client'

import React, { useId } from 'react'

interface LoadingSpinnerProps {
  id?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function LoadingSpinner({ 
  id, 
  size = 'md', 
  color = 'text-teal-600' 
}: LoadingSpinnerProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const strokeWidthClasses = {
    sm: 'stroke-2',
    md: 'stroke-2',
    lg: 'stroke-[1.5]'
  }

  return (
    <div 
      id="loading-spinner-container"
      className="flex items-center justify-center"
    >
      <div 
        id="loading-spinner-wrapper"
        className="relative"
      >
        <svg
          id="loading-spinner-svg"
          className={`${sizeClasses[size]} animate-spin ${color}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            id="loading-spinner-background-circle"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-25"
          />
          <path
            id="loading-spinner-progress-path"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            className="opacity-75"
          />
        </svg>
        
        <div 
          id="loading-spinner-pulse-ring"
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-current opacity-20 animate-ping`}
          style={{ animationDuration: '1.5s' }}
        />
      </div>
      
      <span 
        id="loading-spinner-text"
        className="ml-3 text-sm font-medium text-gray-600 animate-pulse"
      >
        Loading...
      </span>
    </div>
  )
}