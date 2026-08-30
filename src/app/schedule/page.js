import { createClient } from '@/utils/supabase/server'
import { signUpForShift, cancelShiftSignup } from './actions'
import Link from 'next/link'

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch upcoming shifts with profile info of signed up volunteers
  const { data: shifts } = await supabase
    .from('shifts')
    .select('*, shift_signups(user_id, profiles(name, photo_url))')
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
            const signups = shift.shift_signups || []
            const signupsCount = signups.length
            const isFull = signupsCount >= shift.max_volunteers
            const isClass = shift.type === 'class'
            
            // Check if current user is signed up
            const isSignedUp = user ? signups.some(s => s.user_id === user.id) : false

            return (
              <div key={shift.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ color: 'var(--primary-purple)', fontWeight: 'bold', fontSize: '1.15rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>{shift.title}</span>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '12px', textTransform: 'capitalize' }}>
                      {shift.type.replace('_', ' ')}
                    </span>
                    {isClass && (
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(59, 181, 181, 0.15)', color: 'var(--teal)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'normal' }}>
                        Weekly Class
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#2d3748' }}>
                    <strong>{startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</strong> • {startDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </div>

                  {shift.description && (
                    <div className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                      {shift.description}
                    </div>
                  )}

                  {/* Show signed-up volunteers */}
                  {signups.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500' }}>Signed up:</span>
                      {signups.map((s, idx) => (
                        <span key={idx} style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', color: '#334155' }}>
                          {s.profiles?.name || 'Volunteer'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: isFull ? 'var(--coral-red)' : 'var(--teal)' }}>
                      {signupsCount} / {shift.max_volunteers}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Volunteers</div>
                  </div>

                  {!user ? (
                    <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Log in to Sign Up</Link>
                  ) : isSignedUp ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 'bold', textAlign: 'center' }}>✓ You are signed up</span>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <form action={cancelShiftSignup}>
                          <input type="hidden" name="shift_id" value={shift.id} />
                          <input type="hidden" name="cancel_recurring" value="false" />
                          <button className="btn" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#475569' }}>
                            Cancel this day
                          </button>
                        </form>
                        {isClass && (
                          <form action={cancelShiftSignup}>
                            <input type="hidden" name="shift_id" value={shift.id} />
                            <input type="hidden" name="cancel_recurring" value="true" />
                            <button className="btn" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                              Cancel all upcoming
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ) : isFull ? (
                    <button className="btn btn-secondary" disabled style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', opacity: 0.5 }}>Shift Full</button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <form action={signUpForShift}>
                        <input type="hidden" name="shift_id" value={shift.id} />
                        <input type="hidden" name="recurring" value="false" />
                        <button className="btn btn-primary" style={{ width: '100%', padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                          Sign Up (This Date)
                        </button>
                      </form>
                      {isClass && (
                        <form action={signUpForShift}>
                          <input type="hidden" name="shift_id" value={shift.id} />
                          <input type="hidden" name="recurring" value="true" />
                          <button className="btn" style={{ width: '100%', padding: '0.45rem 1rem', fontSize: '0.8rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: '500' }}>
                            🔁 Sign Up for All Weeks
                          </button>
                        </form>
                      )}
                    </div>
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
