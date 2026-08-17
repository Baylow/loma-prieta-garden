import { createClient } from '@/utils/supabase/server'

export default async function VolunteersAdminPage() {
  const supabase = await createClient()
  
  // Fetch all profiles
  const { data: volunteers } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--sapphire-blue)' }}>Volunteer Directory</h2>
      <p className="text-muted mb-4">View all registered members.</p>
      
      {(!volunteers || volunteers.length === 0) ? (
        <p>No volunteers registered yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                <th style={{ padding: '1rem 0.5rem' }}>Contact</th>
                <th style={{ padding: '1rem 0.5rem' }}>Personal Info</th>
                <th style={{ padding: '1rem 0.5rem' }}>Role Type</th>
                <th style={{ padding: '1rem 0.5rem' }}>Class Info</th>
                <th style={{ padding: '1rem 0.5rem' }}>Avail. Hours</th>
                <th style={{ padding: '1rem 0.5rem' }}>Training?</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {v.photo_url && <img src={v.photo_url} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />}
                      {v.name}
                      {v.role === 'admin' && <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--teal)', color: 'white', padding: '2px 6px', borderRadius: '12px', marginLeft: '4px' }}>Admin</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div><a href={`mailto:${v.email}`} style={{ color: 'var(--sapphire-blue)' }}>{v.email}</a></div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{v.phone} (Prefers {v.contact_preference})</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.8rem', maxWidth: '250px' }}>
                    {v.relationship && <div><strong>Rel:</strong> {v.relationship}</div>}
                    {v.kids_names && <div><strong>Kids:</strong> {v.kids_names}</div>}
                    {v.bio && <div className="text-muted mt-1" style={{ fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{v.bio}"</div>}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textTransform: 'capitalize' }}>{v.volunteer_type}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{v.class_info}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{v.hours_per_month}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{v.training_interest ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
