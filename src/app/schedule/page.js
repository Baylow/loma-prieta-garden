import { createClient } from '@/utils/supabase/server'
import { signUpForShift, cancelShiftSignup } from './actions'
import Link from 'next/link'

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch upcoming shifts
  const { data: shifts } = await supabase
    .from('shifts')
    .select('*, shift_signups(user_id)')
    .order('start_time', { ascending: true })
    .gte('start_time', new Date().toISOString())

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <h1 className="text-center mb-4">Volunteer Schedule</h1>
      <p className="text-center mb-8 text-muted">Sign up to help with classes, special events, or weekend garden work.</p>
      
      {(!shifts || shifts.length === 0) ? (
        <div className="text-center text-muted glass-panel p-8">
          <p>No upcoming shifts are scheduled right now. Check back later!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {shifts.map(shift => {
            const startDate = new Date(shift.start_time)
            const endDate = new Date(shift.end_time)
            const signupsCount = shift.shift_signups.length
            const isFull = signupsCount >= shift.max_volunteers
            
            // Check if current user is signed up
            const isSignedUp = user ? shift.shift_signups.some(s => s.user_id === user.id) : false

            return (
              <div key={shift.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ color: 'var(--primary-purple)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {shift.title} <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px', verticalAlign: 'middle', textTransform: 'capitalize' }}>{shift.type.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>{startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</strong> • {startDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  {shift.description && <div className="text-muted" style={{ fontSize: '0.875rem' }}>{shift.description}</div>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isFull ? 'var(--coral-red)' : 'var(--teal)' }}>
                      {signupsCount} / {shift.max_volunteers}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Volunteers</div>
                  </div>

                  {!user ? (
                    <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Log in to Sign Up</Link>
                  ) : isSignedUp ? (
                    <form action={cancelShiftSignup}>
                      <input type="hidden" name="shift_id" value={shift.id} />
                      <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#e2e8f0', color: '#333' }}>Cancel Signup</button>
                    </form>
                  ) : isFull ? (
                    <button className="btn btn-secondary" disabled style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', opacity: 0.5 }}>Shift Full</button>
                  ) : (
                    <form action={signUpForShift}>
                      <input type="hidden" name="shift_id" value={shift.id} />
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Sign Up</button>
                    </form>
                  )}
                </div>
                
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
