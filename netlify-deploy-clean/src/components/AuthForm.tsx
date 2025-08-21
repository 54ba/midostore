'use client'

import { useState, useId } from 'react'
import Link from 'next/link'

interface AuthFormProps {
  id?: string
  type: 'login' | 'register'
  onSubmit: (formData: any) => void
  loading: boolean
  error: string | null
}

export default function AuthForm({ 
  id: providedId, 
  type, 
  onSubmit, 
  loading, 
  error 
}: AuthFormProps) {
  const defaultId = useId()
  const id = providedId || defaultId

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type === 'login') {
      onSubmit({
        email: formData.email,
        password: formData.password
      })
    } else {
      onSubmit(formData)
    }
  }

  const isLogin = type === 'login'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-auto">
            <div 
              id="auth-form-logo"
              className="h-12 w-32 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold text-xl"
            >
              MidoHub
            </div>
          </div>
          <h2 
            id="auth-form-title"
            className="mt-6 text-3xl font-bold text-gray-900"
          >
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p 
            id="auth-form-subtitle"
            className="mt-2 text-sm text-gray-600"
          >
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link 
              href={isLogin ? '/register' : '/login'}
              className="font-medium text-amber-500 hover:text-teal-700 transition-colors"
              id="auth-form-switch-link"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label 
                  htmlFor="auth-form-full-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  id="auth-form-full-name-label"
                >
                  Full Name
                </label>
                <input
                  id="auth-form-full-name"
                  name="full_name"
                  type="text"
                  required={!isLogin}
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label 
                htmlFor="auth-form-email"
                className="block text-sm font-medium text-gray-700 mb-2"
                id="auth-form-email-label"
              >
                Email Address
              </label>
              <input
                id="auth-form-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label 
                htmlFor="auth-form-password"
                className="block text-sm font-medium text-gray-700 mb-2"
                id="auth-form-password-label"
              >
                Password
              </label>
              <input
                id="auth-form-password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label 
                  htmlFor="auth-form-phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  id="auth-form-phone-label"
                >
                  Phone Number
                </label>
                <input
                  id="auth-form-phone"
                  name="phone"
                  type="tel"
                  required={!isLogin}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                  placeholder="Enter your phone number"
                />
              </div>
            )}

            {error && (
              <div 
                id="auth-form-error"
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm"
              >
                {error}
              </div>
            )}

            <div>
              <button
                id="auth-form-submit-button"
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div 
                      id="auth-form-loading-spinner"
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span id="auth-form-loading-text">
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </span>
                  </div>
                ) : (
                  <span id="auth-form-button-text">
                    {isLogin ? 'Sign in' : 'Create account'}
                  </span>
                )}
              </button>
            </div>

            {isLogin && (
              <div className="text-center">
                <Link 
                  href="/forgot-password"
                  className="text-sm text-amber-500 hover:text-teal-700 transition-colors"
                  id="auth-form-forgot-password-link"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>
        </div>

        <div className="text-center">
          <p 
            id="auth-form-terms-text"
            className="text-xs text-gray-500"
          >
            By {isLogin ? 'signing in' : 'creating an account'}, you agree to our{' '}
            <Link 
              href="/terms"
              className="text-amber-500 hover:text-teal-700 transition-colors"
              id="auth-form-terms-link"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link 
              href="/privacy"
              className="text-amber-500 hover:text-teal-700 transition-colors"
              id="auth-form-privacy-link"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}