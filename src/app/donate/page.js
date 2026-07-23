"use client";

export default function Donate() {
  return (
    <div className="container mt-8 animate-fade-in-down">
      <h1 className="text-center mb-4">Support the Garden</h1>
      <div className="glass-panel text-center" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="mb-2">Make a Donation</h2>
        <p className="mb-4 text-muted">
          Your contributions help us buy seeds, tools, and maintain the raised beds for the students.
        </p>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
          <input type="number" placeholder="$ Amount" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <button type="button" className="btn btn-primary" onClick={() => alert('This is a dummy donation button!')}>
            Donate Now
          </button>
        </form>
        <p className="mt-4" style={{ fontSize: '0.9rem' }}>
          <em>Note: This is a placeholder for future payment integration.</em>
        </p>
      </div>
    </div>
  );
}
