import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/login/actions'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile || !profile.onboarded) {
    redirect('/onboarding')
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="container mt-8 mb-12 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h1>Your Profile</h1>
        <form action={logout}>
          <button className="btn btn-secondary">Log Out</button>
        </form>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div>
            <h3 style={{ color: 'var(--teal)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Contact Info</h3>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Preferred Contact:</strong> <span style={{ textTransform: 'capitalize' }}>{profile.contact_preference}</span></p>
          </div>

          <div>
            <h3 style={{ color: 'var(--teal)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Role Info</h3>
            <p><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{profile.volunteer_type}</span> Volunteer</p>
            <p><strong>Class Support:</strong> {profile.class_info}</p>
            <p><strong>Training Interest:</strong> {profile.training_interest ? 'Yes' : 'No'}</p>
            {profile.role === 'admin' && (
              <div className="mt-4 p-4" style={{ backgroundColor: 'rgba(59, 181, 181, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--teal)' }}>
                <p><strong>Administrator Account</strong></p>
                <Link href="/admin" className="btn btn-primary" style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.5rem 1rem' }}>Go to Admin Dashboard</Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 style={{ color: 'var(--teal)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Availability</h3>
          <p className="mb-4"><strong>Total available hours per month:</strong> {profile.hours_per_month}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
            {days.map(day => {
              const dayKey = day.toLowerCase()
              const avail = profile.availability[dayKey]
              if (!avail.morning && !avail.afternoon) return null; // Only show days they are available
              
              return (
                <div key={day} style={{ backgroundColor: '#f8f6fc', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
                  <div style={{ fontWeight: '600', color: 'var(--primary-purple)', marginBottom: '0.5rem' }}>{day}</div>
                  {avail.morning && <div style={{ fontSize: '0.875rem' }}>Morning</div>}
                  {avail.afternoon && <div style={{ fontSize: '0.875rem' }}>Afternoon</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
