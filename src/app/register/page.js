'use client'

import { useState, useRef } from 'react'
import { registerAndOnboard } from './actions'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  function handleNextStep(e) {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email to continue.")
      return
    }
    setError(null)
    setStep(2)
  }

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    
    // Ensure email is passed correctly from state to formData
    if (!formData.get('email')) {
      formData.set('email', email)
    }

    const result = await registerAndOnboard(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="container mt-8 mb-12 flex justify-center animate-fade-in-up">
      <div className="glass-panel" style={{ width: '100%', maxWidth: step === 1 ? '400px' : '800px', padding: '2.5rem', transition: 'max-width 0.3s ease' }}>
        <h1 className="text-center mb-2">Create Account</h1>
        <p className="text-center text-muted mb-8" style={{ fontSize: '0.875rem' }}>Sign up to become a garden volunteer.</p>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address *</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Continue
            </button>
            <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
              Already have an account? <Link href="/login" style={{ fontWeight: '600' }}>Log in</Link>
            </div>
          </form>
        ) : (
          <form action={handleSubmit} ref={formRef} className="flex flex-col gap-8 animate-fade-in-up">
            <input type="hidden" name="email" value={email} />

            {/* Section 1: Basic Info */}
            <section>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. Account & Contact Information</h3>
              <div className="flex flex-col gap-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" style={{ fontWeight: '500' }}>Create Password *</label>
                    <input id="password" name="password" type="password" required minLength="6" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" style={{ fontWeight: '500' }}>Full Name *</label>
                    <input id="name" name="name" type="text" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" style={{ fontWeight: '500' }}>Phone Number *</label>
                    <input id="phone" name="phone" type="tel" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label style={{ fontWeight: '500' }}>Preferred Contact Method *</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2"><input type="radio" name="contact_preference" value="email" required /> Email</label>
                      <label className="flex items-center gap-2"><input type="radio" name="contact_preference" value="phone" required /> Phone/Text</label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Personal (Optional) Info */}
            <section>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. Tell Us About Yourself (Optional)</h3>
              <div className="flex flex-col gap-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="photo_url" style={{ fontWeight: '500' }}>Profile Photo URL</label>
                    <input id="photo_url" name="photo_url" type="url" placeholder="https://..." style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="relationship" style={{ fontWeight: '500' }}>Relationship to Student(s)</label>
                    <input id="relationship" name="relationship" type="text" placeholder="e.g. Parent, Grandparent, Guardian" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="kids_names" style={{ fontWeight: '500' }}>Kid(s) Names</label>
                  <input id="kids_names" name="kids_names" type="text" placeholder="e.g. Tommy (3rd Grade)" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="bio" style={{ fontWeight: '500' }}>Short Bio</label>
                  <textarea id="bio" name="bio" rows="2" placeholder="I love gardening and have 3 years of experience growing tomatoes..." style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} />
                </div>
              </div>
            </section>

            {/* Section 3: Role & Class */}
            <section>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. Role & Classroom</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="volunteer_type" style={{ fontWeight: '500' }}>Volunteer Type *</label>
                  <select id="volunteer_type" name="volunteer_type" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                    <option value="">Select a role...</option>
                    <option value="class">Class Volunteer (Helps run classes with students)</option>
                    <option value="support">Support Volunteer (Weekend cleanup, weeding, manual work)</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="class_info" style={{ fontWeight: '500' }}>Student's Class (or class you'd like to support) *</label>
                  <input id="class_info" name="class_info" type="text" placeholder="e.g. Grade 3 - Mrs. Smith" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>
            </section>

            {/* Section 4: Availability */}
            <section>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>4. Availability</h3>
              <div className="flex flex-col gap-4">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Check the times you are generally available to volunteer.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '1rem' }}>
                  {days.map(day => (
                    <div key={day} style={{ border: '1px solid #eee', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{day.substring(0, 3)}</div>
                      <div className="flex flex-col items-center gap-2" style={{ fontSize: '0.875rem' }}>
                        <label className="flex items-center gap-1">
                          <input type="checkbox" name={`${day.substring(0, 3).toLowerCase()}_m`} /> AM
                        </label>
                        <label className="flex items-center gap-1">
                          <input type="checkbox" name={`${day.substring(0, 3).toLowerCase()}_a`} /> PM
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="hours_per_month" style={{ fontWeight: '500' }}>Estimated Available Hours per Month</label>
                  <input id="hours_per_month" name="hours_per_month" type="number" min="0" placeholder="e.g. 4" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', maxWidth: '200px' }} />
                </div>
              </div>
            </section>

            {/* Section 5: Training */}
            <section>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>5. Live Training</h3>
              <div className="flex flex-col gap-2">
                <label style={{ fontWeight: '500' }}>Are you interested in attending live training sessions? (e.g., managing kids, garden best practices)</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2"><input type="radio" name="training_interest" value="yes" required /> Yes, please notify me</label>
                  <label className="flex items-center gap-2"><input type="radio" name="training_interest" value="no" required /> No thanks</label>
                </div>
              </div>
            </section>

            <div className="flex gap-4 mt-4">
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ padding: '1rem' }}>Back</button>
              <button type="submit" className="btn btn-primary flex-1" style={{ padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                {loading ? 'Creating account...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
