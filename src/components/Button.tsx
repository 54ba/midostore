"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'gradient' | 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gradient' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const variantClasses: { [key: string]: string } = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    link: 'text-blue-600 hover:text-blue-800 underline',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white'
  };

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  ].join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}

      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}

      {children}

      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
}