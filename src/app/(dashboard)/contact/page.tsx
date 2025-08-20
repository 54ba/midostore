'use client'

import { useState } from 'react'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

interface ContactData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleContactSubmit = async (contactData: ContactData) => {
    setLoading(true)
    try {
      // Simulate form submission - in a real app this would send to a contact API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
    } catch (error) {
      console.error('Contact form submission failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
        <div className="flex-1 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-[rgb(var(--success))] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  id="success-check-icon"
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 id="success-title" className="text-3xl font-bold text-[rgb(var(--foreground))] mb-4">
                Message Sent Successfully!
              </h1>
              <p id="success-description" className="text-lg text-gray-600 mb-8">
                Thank you for contacting MidoHub. Our support team will get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div 
                  id="back-to-dashboard-button"
                  onClick={() => window.location.href = '/dashboard'}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[rgb(var(--primary))] text-white font-medium rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors cursor-pointer"
                >
                  Back to Dashboard
                </div>
                <div 
                  id="send-another-message-button"
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-[rgb(var(--primary))] text-[rgb(var(--primary))] font-medium rounded-lg hover:bg-[rgb(var(--primary))]/10 transition-colors cursor-pointer"
                >
                  Send Another Message
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer id="contact-success-footer" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col">
      <div className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="contact-page-title" className="text-4xl font-bold text-[rgb(var(--foreground))] mb-4">
              Contact Us
            </h1>
            <p id="contact-page-description" className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our dropshipping services? Need help with your orders? 
              Our dedicated support team is here to assist you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div id="contact-info-section">
              <h2 id="contact-info-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div id="contact-email-info" className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[rgb(var(--primary))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg 
                      id="email-icon"
                      className="w-6 h-6 text-[rgb(var(--primary))]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 id="email-title" className="font-semibold text-[rgb(var(--foreground))] mb-1">
                      Email Support
                    </h3>
                    <p id="email-description" className="text-gray-600 mb-1">
                      Get help with your orders and account
                    </p>
                    <p id="email-address" className="text-[rgb(var(--primary))] font-medium">
                      support@midohub.com
                    </p>
                  </div>
                </div>

                <div id="contact-phone-info" className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[rgb(var(--primary))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg 
                      id="phone-icon"
                      className="w-6 h-6 text-[rgb(var(--primary))]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 id="phone-title" className="font-semibold text-[rgb(var(--foreground))] mb-1">
                      Phone Support
                    </h3>
                    <p id="phone-description" className="text-gray-600 mb-1">
                      Speak directly with our team
                    </p>
                    <p id="phone-number" className="text-[rgb(var(--primary))] font-medium">
                      +971 4 123 4567
                    </p>
                  </div>
                </div>

                <div id="contact-hours-info" className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[rgb(var(--primary))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg 
                      id="clock-icon"
                      className="w-6 h-6 text-[rgb(var(--primary))]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 id="hours-title" className="font-semibold text-[rgb(var(--foreground))] mb-1">
                      Business Hours
                    </h3>
                    <p id="hours-description" className="text-gray-600 mb-1">
                      Sunday - Thursday: 9:00 AM - 6:00 PM GST
                    </p>
                    <p id="hours-weekend" className="text-gray-600">
                      Friday - Saturday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div id="faq-section" className="mt-12">
                <h3 id="faq-title" className="text-xl font-bold text-[rgb(var(--foreground))] mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div id="faq-item-1" className="border border-gray-200 rounded-lg p-4">
                    <h4 id="faq-question-1" className="font-semibold text-[rgb(var(--foreground))] mb-2">
                      How long does shipping take?
                    </h4>
                    <p id="faq-answer-1" className="text-gray-600 text-sm">
                      Shipping typically takes 7-14 business days for Gulf region deliveries from our Alibaba partners.
                    </p>
                  </div>
                  <div id="faq-item-2" className="border border-gray-200 rounded-lg p-4">
                    <h4 id="faq-question-2" className="font-semibold text-[rgb(var(--foreground))] mb-2">
                      What is your return policy?
                    </h4>
                    <p id="faq-answer-2" className="text-gray-600 text-sm">
                      We offer a 30-day return policy for defective or damaged items. Contact our support team to initiate a return.
                    </p>
                  </div>
                  <div id="faq-item-3" className="border border-gray-200 rounded-lg p-4">
                    <h4 id="faq-question-3" className="font-semibold text-[rgb(var(--foreground))] mb-2">
                      Do you offer bulk discounts?
                    </h4>
                    <p id="faq-answer-3" className="text-gray-600 text-sm">
                      Yes! Contact us for special pricing on bulk orders of 50+ units of the same product.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div id="contact-form-section">
              <ContactForm 
                id="main-contact-form"
                onSubmit={handleContactSubmit}
                loading={loading}
              />
            </div>
          </div>

          <div id="additional-resources-section" className="bg-white rounded-lg shadow-lg p-8">
            <h2 id="resources-title" className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6 text-center">
              Additional Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div id="resource-orders" className="text-center">
                <div className="w-16 h-16 bg-[rgb(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    id="orders-icon"
                    className="w-8 h-8 text-[rgb(var(--primary))]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 id="orders-resource-title" className="font-semibold text-[rgb(var(--foreground))] mb-2">
                  Track Your Orders
                </h3>
                <p id="orders-resource-description" className="text-gray-600 text-sm mb-4">
                  Monitor your order status and shipping progress
                </p>
                <div 
                  id="track-orders-link"
                  onClick={() => window.location.href = '/orders'}
                  className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] font-medium cursor-pointer transition-colors"
                >
                  View Orders →
                </div>
              </div>

              <div id="resource-profile" className="text-center">
                <div className="w-16 h-16 bg-[rgb(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    id="profile-icon"
                    className="w-8 h-8 text-[rgb(var(--primary))]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 id="profile-resource-title" className="font-semibold text-[rgb(var(--foreground))] mb-2">
                  Manage Profile
                </h3>
                <p id="profile-resource-description" className="text-gray-600 text-sm mb-4">
                  Update your account information and preferences
                </p>
                <div 
                  id="manage-profile-link"
                  onClick={() => window.location.href = '/profile'}
                  className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] font-medium cursor-pointer transition-colors"
                >
                  Edit Profile →
                </div>
              </div>

              <div id="resource-products" className="text-center">
                <div className="w-16 h-16 bg-[rgb(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    id="products-icon"
                    className="w-8 h-8 text-[rgb(var(--primary))]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 id="products-resource-title" className="font-semibold text-[rgb(var(--foreground))] mb-2">
                  Browse Products
                </h3>
                <p id="products-resource-description" className="text-gray-600 text-sm mb-4">
                  Explore our collection of toys and cosmetics
                </p>
                <div 
                  id="browse-products-link"
                  onClick={() => window.location.href = '/dashboard'}
                  className="text-[rgb(var(--primary))] hover:text-[rgb(var(--secondary))] font-medium cursor-pointer transition-colors"
                >
                  Shop Now →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer id="contact-page-footer" />
    </div>
  )
}