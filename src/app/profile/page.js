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

  if (!profile) {
    return (
      <div className="container mt-8 text-center">
        <h1>Profile Not Found</h1>
        <p>Please contact an administrator.</p>
      </div>
    )
  }

  // Fetch upcoming shifts the user is signed up for
  const { data: signups } = await supabase
    .from('shift_signups')
    .select('shift_id, shifts(*)')
    .eq('user_id', user.id)
    
  const upcomingShifts = signups
    ?.map(s => s.shifts)
    .filter(shift => new Date(shift.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)) || []

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
        {/* Personal Details Section */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
          {profile.photo_url && (
            <div style={{ flexShrink: 0 }}>
              <img src={profile.photo_url} alt="Profile Photo" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--teal)' }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary-purple)' }}>{profile.name}</h2>
            {profile.bio && <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '1rem' }}>"{profile.bio}"</p>}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {profile.relationship && <p><strong>Relationship:</strong> {profile.relationship}</p>}
              {profile.kids_names && <p><strong>Kids:</strong> {profile.kids_names}</p>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div>
            <h3 style={{ color: 'var(--teal)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Contact Info</h3>
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

        <div className="mt-8">
          <h3 style={{ color: 'var(--teal)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>My Upcoming Shifts</h3>
          {upcomingShifts.length === 0 ? (
            <p className="text-muted">You are not signed up for any upcoming shifts. <Link href="/schedule" style={{ color: 'var(--sapphire-blue)', textDecoration: 'underline' }}>View the schedule to sign up.</Link></p>
          ) : (
            <div className="flex flex-col gap-4">
              {upcomingShifts.map(shift => {
                const startDate = new Date(shift.start_time)
                const endDate = new Date(shift.end_time)
                return (
                  <div key={shift.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-purple)' }}>{shift.title}</div>
                      <div style={{ fontSize: '0.875rem' }}>
                        {startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} • {startDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                    <Link href="/schedule" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Manage</Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
