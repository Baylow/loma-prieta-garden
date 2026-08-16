
import { createClient } from '@/utils/supabase/server';

export default async function Updates() {
  const supabase = await createClient()
  
  // Fetch recent updates
  const { data: updates } = await supabase.from('updates').select('*').order('created_at', { ascending: false })

  return (
    <div className="container mt-8 animate-fade-in-down">
      <h1 className="text-center mb-4">Garden News & Updates</h1>
      <p className="text-center mb-8 text-muted">Stay in the loop with what's happening in the garden.</p>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {(!updates || updates.length === 0) ? (
          <div className="glass-panel text-center" style={{ padding: '3rem' }}>
            <p className="text-muted">No updates yet. Check back soon!</p>
          </div>
        ) : (
          updates.map((update, index) => (
            <div key={update.id} className="glass-panel mb-4" style={{ padding: '1.5rem', animationDelay: `${index * 0.1}s` }}>
              <h3 style={{ color: 'var(--sapphire-blue)', marginBottom: '0.5rem' }}>{update.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Posted by {update.author} on {new Date(update.created_at).toLocaleDateString()}</p>
              <p>{update.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
