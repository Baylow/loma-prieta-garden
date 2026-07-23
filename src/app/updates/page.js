"use client";

export default function Updates() {
  return (
    <div className="container mt-8 animate-fade-in-up">
      <h1 className="text-center mb-4">Garden Updates</h1>
      
      <div className="glass-panel mb-8" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Join Our Mailing List</h2>
        <p className="mb-4 text-muted">Sign up to receive the latest news, harvest schedules, and event invitations.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <input type="email" placeholder="Enter your email" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', width: '300px' }} />
          <button type="button" className="btn btn-secondary" onClick={() => alert('Thanks for subscribing (dummy)!')}>Subscribe</button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <article className="glass-panel mb-4" style={{ padding: '1.5rem' }}>
          <h3>Spring Planting Commences!</h3>
          <p className="text-muted mb-2">March 15, 2026</p>
          <p>The 4th graders spent the afternoon planting tomato seeds in the greenhouse...</p>
        </article>
      </div>
    </div>
  );
}
