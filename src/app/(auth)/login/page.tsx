'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import AuthForm from '@/components/AuthForm'

// Hash password using SHA256
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (formData: { email: string; password: string }) => {
    setLoading(true)
    setError(null)

    try {
      // Hash password before sending to backend
      const hashedPassword = await hashPassword(formData.password)

      // Use AuthContext login method
      await login(formData.email, hashedPassword)

      // Redirect to dashboard on successful login
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="login-page" className="w-full">
      <AuthForm
        id="login-form"
        type="login"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  )
}