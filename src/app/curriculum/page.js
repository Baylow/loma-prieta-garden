export default function Curriculum() {
  return (
    <div className="container mt-8 animate-fade-in-up">
      <h1 className="text-center mb-4">Garden Curriculum</h1>
      
      <div style={{ maxWidth: '800px', margin: '4rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '4rem 2rem', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary-purple)', marginBottom: '1rem', fontSize: '2rem' }}>Coming Soon</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>We are currently updating our curriculum details. Check back soon!</p>
        </div>
      </div>
    </div>
  );
}
