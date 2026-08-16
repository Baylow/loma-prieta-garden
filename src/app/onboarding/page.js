import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { saveProfile } from './actions'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if already onboarded
  const { data: profile } = await supabase.from('profiles').select('onboarded').eq('id', user.id).single()
  if (profile?.onboarded) {
    redirect('/profile')
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="container mt-8 mb-12 animate-fade-in-up">
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
        <h1 className="text-center mb-2">Complete Your Profile</h1>
        <p className="text-center text-muted mb-8">We need a little more information before you can start volunteering.</p>

        <form action={saveProfile} className="flex flex-col gap-8">
          {/* Section 1: Basic Info */}
          <section>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. Contact Information</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" style={{ fontWeight: '500' }}>Full Name *</label>
                <input id="name" name="name" type="text" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" style={{ fontWeight: '500' }}>Email</label>
                  <input id="email" type="email" value={user.email} disabled style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #eee', backgroundColor: '#f9f9f9', color: '#666' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" style={{ fontWeight: '500' }}>Phone Number *</label>
                  <input id="phone" name="phone" type="tel" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label style={{ fontWeight: '500' }}>Preferred Contact Method *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="contact_preference" value="email" required /> Email</label>
                  <label className="flex items-center gap-2"><input type="radio" name="contact_preference" value="phone" required /> Phone / Text</label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Role & Class */}
          <section>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. Role & Classroom</h3>
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

          {/* Section 3: Availability */}
          <section>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. Availability</h3>
            <div className="flex flex-col gap-4">
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Check the times you are generally available to volunteer.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                {days.map(day => (
                  <div key={day} style={{ border: '1px solid #eee', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{day}</div>
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

          {/* Section 4: Training */}
          <section>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>4. Live Training</h3>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500' }}>Are you interested in attending live training sessions? (e.g., managing kids, garden best practices)</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2"><input type="radio" name="training_interest" value="yes" required /> Yes, please notify me</label>
                <label className="flex items-center gap-2"><input type="radio" name="training_interest" value="no" required /> No thanks</label>
              </div>
            </div>
          </section>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  )
}
