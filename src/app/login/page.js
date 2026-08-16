'use client'

import { useState } from 'react'
import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel animate-fade-in-down" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <h1 className="text-center mb-2">Welcome Back</h1>
        <p className="text-center text-muted mb-8" style={{ fontSize: '0.875rem' }}>Log in to manage your volunteer schedule.</p>
        
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
            <input id="password" name="password" type="password" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          
          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <div className="text-center mt-8" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link href="/register" style={{ fontWeight: '600' }}>Sign up</Link>
        </div>
      </div>
    </div>
  )
}
