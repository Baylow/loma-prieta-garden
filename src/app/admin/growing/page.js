import { createClient } from '@/utils/supabase/server'
import AdminGridEditor from './AdminGridEditor'

export default async function GrowingAdminPage() {
  const supabase = await createClient()
  
  // Custom sort function to sort "Bed 1" through "Bed 12" properly instead of alphabetically
  const { data: bedsData } = await supabase.from('garden_beds').select('*')
  
  const beds = bedsData?.sort((a, b) => {
    const numA = parseInt(a.bed_number.replace(/\D/g, ''), 10) || 0
    const numB = parseInt(b.bed_number.replace(/\D/g, ''), 10) || 0
    return numA - numB
  }) || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem', color: 'var(--sapphire-blue)' }}>Manage Garden Beds</h2>
          <p className="text-muted">Update what is currently growing in each square foot of our 12 garden beds.</p>
        </div>
        <div>
          <a href="/growing/qr" target="_blank" className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
            📱 Print Bed QR Placards ↗
          </a>
        </div>
      </div>
      
      {(!beds || beds.length === 0) ? (
        <p className="text-muted">No beds configured yet. Please run the grid setup SQL script.</p>
      ) : (
        <div>
          {beds.map(b => (
            <AdminGridEditor key={b.id} bed={b} />
          ))}
        </div>
      )}
    </div>
  )
}
