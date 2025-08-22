'use client'

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'green' | 'red' | 'gray';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'blue',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-2 border-gray-200 dark:border-gray-700 rounded-full animate-pulse`}
        />
        <div
          className={`absolute top-0 left-0 ${sizeClasses[size]} border-2 border-transparent ${colorClasses[color]} border-t-current rounded-full animate-spin`}
        />
      </div>
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300 animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );
}

// Skeleton loading component for content
export function SkeletonLoader({
  lines = 3,
  className = '',
  animate = true
}: {
  lines?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${animate ? 'animate-pulse' : ''
            }`}
          style={{
            width: index === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  );
}

// Card skeleton for product cards
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}>
      <div className="animate-pulse">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />

        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />

        {/* Price skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />

        {/* Rating skeleton */}
        <div className="flex space-x-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
    </div>
  );
}