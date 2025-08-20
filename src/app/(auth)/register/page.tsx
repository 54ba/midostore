'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async (formData: {
    full_name: string
    email: string
    password: string
    phone: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      // Hash password with SHA256 before sending
      const encoder = new TextEncoder()
      const data = encoder.encode(formData.password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // POST /api/auth/register - Create new user account with email, password, full name, and phone number
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: hashedPassword,
          full_name: formData.full_name,
          phone: formData.phone
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Registration successful, redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(result.error || 'Registration failed. Please check your information and try again.')
      }
    } catch (err) {
      setError('Network error occurred. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      id="register-form"
      type="register"
      onSubmit={handleRegister}
      loading={loading}
      error={error}
    />
  )
}