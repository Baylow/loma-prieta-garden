export default function About() {
  return (
    <div className="container mt-8 animate-fade-in-up">
      <h1 className="text-center mb-4">About the Garden</h1>
      
      <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <h2 style={{ color: 'var(--primary-purple)', marginBottom: '1rem' }}>Our Living Classroom</h2>
        <p className="mb-6" style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>
          The Loma Prieta School Garden is a vibrant hands-on learning environment for our students. 
          Here, kids connect textbook science with the soil—learning where their food comes from, how ecosystems work, 
          and the importance of sustainable stewardship. From composting and seed-starting to tasting sweet garden harvests, 
          every student gets to experience the joy of growing.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
          <img src="/images/wheelbarrow_team.jpg" alt="Students working in garden" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
          <img src="/images/garden_straw.jpg" alt="Student smiling in the garden" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
          <img src="/images/corn_harvest.jpg" alt="Harvesting corn" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
        </div>

        <h2 style={{ color: 'var(--teal)', marginTop: '2rem', marginBottom: '1rem' }}>Get Involved</h2>
        <p className="mb-4" style={{ lineHeight: '1.7' }}>
          Our garden is powered by enthusiastic parent volunteers, teachers, and community members. 
          Whether you have a green thumb or are just eager to lend a hand during your child's class block, 
          there is a place for you in the garden!
        </p>
      </div>
    </div>
  );
}
