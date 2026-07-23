export default function About() {
  return (
    <div className="container mt-8 animate-fade-in-up">
      <h1 className="text-center mb-4">About the Garden</h1>
      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Our History</h2>
        <p className="mb-4">
          The Loma Prieta School Garden started as a small patch of dirt and a big dream. 
          Over the years, thanks to the dedication of teachers, parents, and students, 
          it has blossomed into a thriving educational ecosystem.
        </p>
        <h2>Meet the Team</h2>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
          <li className="mb-2"><strong>Ms. Ramirez:</strong> Science Teacher & Garden Coordinator</li>
          <li className="mb-2"><strong>Mr. Chen:</strong> Parent Volunteer Lead</li>
          <li><strong>The Green Team:</strong> Our amazing student volunteers!</li>
        </ul>
      </div>
    </div>
  );
}
