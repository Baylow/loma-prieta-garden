export default function AdminDashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--sapphire-blue)' }}>Welcome to the Admin Portal</h2>
      <p className="text-muted">Use the sidebar to navigate through the different management sections.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f8f6fc', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Volunteer Directory</h3>
          <p style={{ fontSize: '0.875rem' }} className="text-muted">View all registered volunteers and their availability.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#f8f6fc', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Site Content</h3>
          <p style={{ fontSize: '0.875rem' }} className="text-muted">Edit the homepage mission statement and announcements.</p>
        </div>
      </div>
    </div>
  )
}
