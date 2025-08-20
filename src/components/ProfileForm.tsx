'use client'

import { useId, useState } from 'react'

interface User {
  user_id: string
  email: string
  full_name: string
  phone: string
}

interface ProfileFormProps {
  id?: string
  user: User
  onSubmit: (userData: { full_name: string; phone: string; email: string }) => void
  loading: boolean
}

export default function ProfileForm({ id, user, onSubmit, loading }: ProfileFormProps) {
  const defaultId = useId()
  const componentId = id || defaultId
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  })
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h2 id="profile-form-title" className="text-2xl font-bold text-gray-900 mb-2">
          Profile Information
        </h2>
        <p id="profile-form-description" className="text-gray-600">
          Update your personal information and contact details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label 
              htmlFor="profile-form-full-name"
              id="profile-form-full-name-label"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="profile-form-full-name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.full_name && (
              <p id="profile-form-full-name-error" className="text-sm text-red-600">
                {errors.full_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="profile-form-phone"
              id="profile-form-phone-label"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="profile-form-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
              disabled={loading}
            />
            {errors.phone && (
              <p id="profile-form-phone-error" className="text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="profile-form-email"
            id="profile-form-email-label"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="profile-form-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {errors.email && (
            <p id="profile-form-email-error" className="text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span id="profile-form-status" className="text-sm text-gray-600">
              Profile information is secure and encrypted
            </span>
          </div>
          
          <button
            id="profile-form-submit-button"
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span id="profile-form-submit-text">
              {loading ? 'Updating...' : 'Update Profile'}
            </span>
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 id="profile-form-security-title" className="text-sm font-medium text-gray-900 mb-2">
          Account Security
        </h3>
        <p id="profile-form-security-description" className="text-sm text-gray-600">
          Your personal information is protected with industry-standard encryption. 
          We never share your data with third parties without your consent.
        </p>
      </div>
    </div>
  )
}