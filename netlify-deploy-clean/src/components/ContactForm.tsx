'use client'

import { useId, useState } from 'react'

interface ContactFormProps {
  id?: string
  onSubmit?: (contactData: { name: string; email: string; subject: string; message: string }) => void
  loading?: boolean
}

export default function ContactForm({ id, onSubmit, loading = false }: ContactFormProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (onSubmit) {
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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 id="contact-form-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
          Get in Touch
        </h2>
        <p id="contact-form-subtitle" className="text-gray-600">
          Have questions about our dropshipping services? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="contact-form-name"
            id="contact-form-name-label"
            className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
          >
            Full Name *
          </label>
          <input
            id="contact-form-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
              errors.name ? 'border-[rgb(var(--error))]' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {errors.name && (
            <p id="contact-form-name-error" className="mt-1 text-sm text-[rgb(var(--error))]">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="contact-form-email"
            id="contact-form-email-label"
            className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
          >
            Email Address *
          </label>
          <input
            id="contact-form-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
              errors.email ? 'border-[rgb(var(--error))]' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {errors.email && (
            <p id="contact-form-email-error" className="mt-1 text-sm text-[rgb(var(--error))]">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label
            htmlFor="contact-form-subject"
            id="contact-form-subject-label"
            className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
          >
            Subject *
          </label>
          <select
            id="contact-form-subject"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors ${
              errors.subject ? 'border-[rgb(var(--error))]' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select a subject</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Product Support">Product Support</option>
            <option value="Order Issues">Order Issues</option>
            <option value="Payment Questions">Payment Questions</option>
            <option value="Shipping Information">Shipping Information</option>
            <option value="Partnership Opportunities">Partnership Opportunities</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Other">Other</option>
          </select>
          {errors.subject && (
            <p id="contact-form-subject-error" className="mt-1 text-sm text-[rgb(var(--error))]">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="contact-form-message"
            id="contact-form-message-label"
            className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
          >
            Message *
          </label>
          <textarea
            id="contact-form-message"
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-colors resize-vertical ${
              errors.message ? 'border-[rgb(var(--error))]' : 'border-gray-300'
            }`}
            placeholder="Please describe your inquiry in detail..."
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <p id="contact-form-message-error" className="text-sm text-[rgb(var(--error))]">
                {errors.message}
              </p>
            ) : (
              <p id="contact-form-message-hint" className="text-sm text-gray-500">
                Minimum 10 characters required
              </p>
            )}
            <span id="contact-form-message-count" className="text-sm text-gray-500">
              {formData.message.length} characters
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            id="contact-form-submit-button"
            type="submit"
            disabled={loading}
            className="w-full bg-[rgb(var(--primary))] text-white py-3 px-6 rounded-lg font-medium hover:bg-[rgb(var(--primary))]/90 focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span id="contact-form-submit-text">Sending Message...</span>
              </>
            ) : (
              <span id="contact-form-submit-text">Send Message</span>
            )}
          </button>
        </div>
      </form>

      {/* Contact Information */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center md:text-left">
            <h3 id="contact-form-response-title" className="text-lg font-semibold text-[rgb(var(--foreground))] mb-2">
              Quick Response
            </h3>
            <p id="contact-form-response-text" className="text-gray-600 text-sm">
              We typically respond to all inquiries within 24 hours during business days.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 id="contact-form-support-title" className="text-lg font-semibold text-[rgb(var(--foreground))] mb-2">
              24/7 Support
            </h3>
            <p id="contact-form-support-text" className="text-gray-600 text-sm">
              Our customer support team is available around the clock to assist you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}