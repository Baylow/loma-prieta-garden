import { createClient } from '@/utils/supabase/server'
import { promoteToAdmin, revokeAdmin } from '../actions'

export default async function VolunteersAdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const { data: currentUserProfile } = await supabase.from('profiles').select('email').eq('id', user?.id).single()
  const userEmail = (user?.email || currentUserProfile?.email || '').toLowerCase().trim()
  const isSuperAdmin = userEmail === 'baylow@gmail.com'

  // Fetch all profiles
  const { data: volunteers } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  // Fetch all signups and shifts to calculate real hours
  const { data: signups } = await supabase.from('shift_signups').select('user_id, shift_id, shifts(*)')

  const now = new Date()
  const userHoursMap = new Map()

  (signups || []).forEach(s => {
    if (!s.shifts) return
    const start = new Date(s.shifts.start_time)
    const end = new Date(s.shifts.end_time)
    const durationHours = Math.max(0.25, (end - start) / (1000 * 60 * 60))
    const isCompleted = end <= now

    const current = userHoursMap.get(s.user_id) || { completedHours: 0, upcomingHours: 0, shiftCount: 0 }
    if (isCompleted) {
      current.completedHours += durationHours
      current.shiftCount += 1
    } else {
      current.upcomingHours += durationHours
    }
    userHoursMap.set(s.user_id, current)
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem', color: 'var(--sapphire-blue)' }}>Volunteer Directory & Hours</h2>
          <p className="text-muted">View registered volunteers, tracked hours, and 10-hour district milestone recognition.</p>
        </div>
        <div>
          <a 
            href="/api/admin/export-hours" 
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>📥</span>
            <span>Export Hours for HSC / District (.csv)</span>
          </a>
        </div>
      </div>
      
      {(!volunteers || volunteers.length === 0) ? (
        <p>No volunteers registered yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Volunteer</th>
                <th style={{ padding: '1rem 0.5rem' }}>Contact</th>
                <th style={{ padding: '1rem 0.5rem' }}>Logged Hours</th>
                <th style={{ padding: '1rem 0.5rem' }}>District 10h Goal</th>
                <th style={{ padding: '1rem 0.5rem' }}>Role Type</th>
                <th style={{ padding: '1rem 0.5rem' }}>Class Info</th>
                {isSuperAdmin && <th style={{ padding: '1rem 0.5rem' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {volunteers.map(v => {
                const stats = userHoursMap.get(v.id) || { completedHours: 0, upcomingHours: 0, shiftCount: 0 }
                const isCertified = stats.completedHours >= 10

                return (
                  <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {v.photo_url && <img src={v.photo_url} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />}
                        <div>
                          <div>{v.name}</div>
                          {v.role === 'admin' && <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--teal)', color: 'white', padding: '1px 5px', borderRadius: '10px' }}>Admin</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div><a href={`mailto:${v.email}`} style={{ color: 'var(--sapphire-blue)' }}>{v.email}</a></div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{v.phone} ({v.contact_preference})</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 'bold', color: stats.completedHours > 0 ? '#166534' : '#64748b', fontSize: '0.95rem' }}>
                        {stats.completedHours.toFixed(1)} hrs
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {stats.shiftCount} shifts ({stats.upcomingHours.toFixed(1)} hrs upcoming)
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {isCertified ? (
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#854d0e', border: '1px solid #fde047', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          ⭐ Certified (10+ hrs)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {(10 - stats.completedHours).toFixed(1)} hrs to goal
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textTransform: 'capitalize' }}>{v.volunteer_type}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{v.class_info || '-'}</td>
                    {isSuperAdmin && (
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {v.role !== 'admin' ? (
                          <form action={promoteToAdmin}>
                            <input type="hidden" name="id" value={v.id} />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Make Admin</button>
                          </form>
                        ) : (
                          <form action={revokeAdmin}>
                            <input type="hidden" name="id" value={v.id} />
                            <button type="submit" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Revoke Admin</button>
                          </form>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
