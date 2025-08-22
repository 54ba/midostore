'use client'

import React, { useState, useId } from 'react'

interface CheckoutFormProps {
  id?: string
  onSubmit: (formData: {
    email: string
    fullName: string
    phone: string
    address: string
    city: string
    country: string
  }) => void
  loading?: boolean
}

export default function CheckoutForm({ id, onSubmit, loading = false }: CheckoutFormProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 id="checkout-form-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
          Checkout Information
        </h2>
        <p id="checkout-form-subtitle" className="text-gray-600">
          Please fill in your details to complete your order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 id="checkout-form-contact-heading" className="text-xl font-semibold text-[rgb(var(--foreground))] border-b border-gray-200 pb-2">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-form-email" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                Email Address *
              </label>
              <input
                id="checkout-form-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
                  errors.email ? 'border-[rgb(var(--error))]' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                disabled={loading}
              />
              {errors.email && (
                <p id="checkout-form-email-error" className="mt-1 text-sm text-[rgb(var(--error))]">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="checkout-form-fullname" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                Full Name *
              </label>
              <input
                id="checkout-form-fullname"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
                  errors.fullName ? 'border-[rgb(var(--error))]' : 'border-gray-300'
                }`}
                placeholder="John Doe"
                disabled={loading}
              />
              {errors.fullName && (
                <p id="checkout-form-fullname-error" className="mt-1 text-sm text-[rgb(var(--error))]">
                  {errors.fullName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="checkout-form-phone" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
              Phone Number *
            </label>
            <input
              id="checkout-form-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
                errors.phone ? 'border-[rgb(var(--error))]' : 'border-gray-300'
              }`}
              placeholder="+1 (555) 123-4567"
              disabled={loading}
            />
            {errors.phone && (
              <p id="checkout-form-phone-error" className="mt-1 text-sm text-[rgb(var(--error))]">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-4">
          <h3 id="checkout-form-shipping-heading" className="text-xl font-semibold text-[rgb(var(--foreground))] border-b border-gray-200 pb-2">
            Shipping Address
          </h3>

          <div>
            <label htmlFor="checkout-form-address" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
              Street Address *
            </label>
            <input
              id="checkout-form-address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
                errors.address ? 'border-[rgb(var(--error))]' : 'border-gray-300'
              }`}
              placeholder="123 Main Street, Apt 4B"
              disabled={loading}
            />
            {errors.address && (
              <p id="checkout-form-address-error" className="mt-1 text-sm text-[rgb(var(--error))]">
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-form-city" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                City *
              </label>
              <input
                id="checkout-form-city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
                  errors.city ? 'border-[rgb(var(--error))]' : 'border-gray-300'
                }`}
                placeholder="New York"
                disabled={loading}
              />
              {errors.city && (
                <p id="checkout-form-city-error" className="mt-1 text-sm text-[rgb(var(--error))]">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="checkout-form-country" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                Country *
              </label>
              <select
                id="checkout-form-country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
                  errors.country ? 'border-[rgb(var(--error))]' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select Country</option>
                <option value="UAE">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Qatar">Qatar</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Oman">Oman</option>
                <option value="Jordan">Jordan</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Egypt">Egypt</option>
                <option value="Morocco">Morocco</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Algeria">Algeria</option>
              </select>
              {errors.country && (
                <p id="checkout-form-country-error" className="mt-1 text-sm text-[rgb(var(--error))]">
                  {errors.country}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            id="checkout-form-submit-button"
            type="submit"
            disabled={loading}
            className="w-full bg-[rgb(var(--primary))] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-[rgb(var(--primary))]/90 focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span id="checkout-form-loading-text">Processing...</span>
              </>
            ) : (
              <span id="checkout-form-submit-text">Continue to Payment</span>
            )}
          </button>
        </div>

        <div className="text-center">
          <p id="checkout-form-security-note" className="text-sm text-gray-500">
            Your information is secure and encrypted
          </p>
        </div>
      </form>
    </div>
  )
}