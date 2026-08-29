import { createClient } from '@/utils/supabase/server';

export default async function Growing() {
  const supabase = await createClient()
  
  const { data: bedsData } = await supabase.from('garden_beds').select('*')
  
  const beds = bedsData?.sort((a, b) => {
    const numA = parseInt(a.bed_number.replace(/\D/g, ''), 10) || 0
    const numB = parseInt(b.bed_number.replace(/\D/g, ''), 10) || 0
    return numA - numB
  }) || []

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <h1 className="text-center mb-4">What's Growing</h1>
      <p className="text-center mb-8 text-muted">Explore the current plants and produce thriving in our garden beds.</p>
      
      {(!beds || beds.length === 0) ? (
        <div className="text-center text-muted" style={{ padding: '3rem' }}>
          <p>The garden beds are currently being prepared for the next season.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {beds.map((bed, index) => {
            const grid = Array.isArray(bed.grid_data) && bed.grid_data.length === 30 ? bed.grid_data : Array(30).fill('');
            return (
              <div key={bed.id} style={{ animationDelay: `${index * 0.1}s` }} className="glass-panel p-4">
                <h3 className="text-center mb-4" style={{ color: 'var(--primary-purple)' }}>{bed.bed_number}</h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(10, 1fr)', 
                  gridTemplateRows: 'repeat(3, 1fr)', 
                  gap: '2px',
                  backgroundColor: '#8B5A2B', // Wooden frame color
                  padding: '6px',
                  borderRadius: '4px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}>
                  {grid.map((cell, i) => (
                    <div 
                      key={i} 
                      title={cell || 'Empty'}
                      style={{
                        aspectRatio: '1',
                        backgroundColor: cell ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        textAlign: 'center',
                        padding: '1px',
                        overflow: 'hidden',
                        color: '#000',
                        wordBreak: 'break-word',
                        lineHeight: '1.1'
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
