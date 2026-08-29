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
      <h2 style={{ marginBottom: '1rem', color: 'var(--sapphire-blue)' }}>Manage Garden Beds</h2>
      <p className="text-muted mb-8">Update what is currently growing in each square foot of our 12 garden beds.</p>
      
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
