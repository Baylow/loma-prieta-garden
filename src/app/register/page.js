'use client'

import { useState } from 'react'
import { signup } from '@/app/login/actions'
import Link from 'next/link'

export default function RegisterPage() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel animate-fade-in-down" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <h1 className="text-center mb-2">Create Account</h1>
        <p className="text-center text-muted mb-8" style={{ fontSize: '0.875rem' }}>Sign up to become a garden volunteer.</p>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email</label>
            <input id="email" name="email" type="email" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
            <input id="password" name="password" type="password" required minLength="6" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          
          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <div className="text-center mt-8" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link href="/login" style={{ fontWeight: '600' }}>Log in</Link>
        </div>
      </div>
    </div>
  )
}
