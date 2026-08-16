import { createClient } from '@/utils/supabase/server'
import { createGardenBed, deleteGardenBed } from '../actions'

export default async function GrowingAdminPage() {
  const supabase = await createClient()
  
  const { data: beds } = await supabase.from('garden_beds').select('*').order('bed_number', { ascending: true })

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--sapphire-blue)' }}>Manage Garden Beds</h2>
      <p className="text-muted mb-8">Update what is currently growing in each bed.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        
        <section>
          <div className="mb-8" style={{ backgroundColor: '#f8f6fc', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
            <h4 className="mb-4">Add New Garden Bed</h4>
            <form action={createGardenBed} className="flex flex-col gap-4">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Bed Identifier</label>
                  <input type="text" name="bed_number" placeholder="e.g. Bed A1 or Front Box" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Plant Name</label>
                  <input type="text" name="plant_name" placeholder="e.g. Cherry Tomatoes" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Expected Harvest Date</label>
                  <input type="text" name="harvest_date" placeholder="e.g. Late October" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Image URL (optional)</label>
                  <input type="text" name="image_url" placeholder="/images/tomatoes.jpg" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Description / Notes</label>
                <textarea name="description" rows="3" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Add Bed</button>
            </form>
          </div>

          <h4 className="mb-4">Current Garden Beds</h4>
          {(!beds || beds.length === 0) ? (
            <p className="text-muted">No beds configured yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Bed</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Plant</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Harvest</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beds.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{b.bed_number}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{b.plant_name}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{b.harvest_date}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <form action={deleteGardenBed}>
                          <input type="hidden" name="id" value={b.id} />
                          <button type="submit" style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
