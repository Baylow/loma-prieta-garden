export default function Curriculum() {
  return (
    <div className="container mt-8 animate-fade-in-up">
      <h1 className="text-center mb-4">Garden Curriculum (K-6)</h1>
      <p className="text-center mb-8 text-muted">See how the garden integrates with our classroom learning.</p>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--teal)' }}>
          <h2 style={{ color: 'var(--teal)' }}>Kindergarten: Senses & Seeds</h2>
          <p>Students explore the garden using their five senses. They plant large seeds (like sunflowers) and learn the fundamental requirements for plant growth: sun, soil, water, and air.</p>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--orange)' }}>
          <h2 style={{ color: 'var(--orange)' }}>1st Grade: Plant Parts</h2>
          <p>We discover the different parts of a plant (roots, stems, leaves, flowers, fruits, and seeds) and identify which parts we eat during our special harvest tasting sessions.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--primary-purple)' }}>
          <h2 style={{ color: 'var(--primary-purple)' }}>2nd Grade: Insects & Pollinators</h2>
          <p>Students learn about the lifecycle of butterflies and ladybugs. We observe pollinators in action and discuss how they help our food grow.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--sapphire-blue)' }}>
          <h2 style={{ color: 'var(--sapphire-blue)' }}>3rd Grade: Soil & Composting</h2>
          <p>We dig deep into soil composition! Students learn how decomposing organic matter creates nutrient-rich compost, and they help manage the school's worm bins.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--teal)' }}>
          <h2 style={{ color: 'var(--teal)' }}>4th Grade: Native Plants & History</h2>
          <p>Tying into California history, 4th graders learn about native plants, traditional uses by indigenous peoples, and the agricultural history of the Santa Cruz Mountains.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--orange)' }}>
          <h2 style={{ color: 'var(--orange)' }}>5th Grade: Water Systems</h2>
          <p>Focusing on sustainability, students study the garden's drip irrigation system, water conservation techniques, and the local watershed.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--primary-purple)' }}>
          <h2 style={{ color: 'var(--primary-purple)' }}>6th Grade: Ecosystems & Climate</h2>
          <p>The garden serves as a living laboratory to study food webs, energy transfer, and how climate factors influence agricultural success.</p>
        </div>

      </div>
    </div>
  );
}
