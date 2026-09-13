import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch site content
  const { data: siteContent } = await supabase.from('site_content').select('*')
  const homepageMission = siteContent?.find(c => c.id === 'homepage_mission')?.content || 'The Loma Prieta School Garden is a living classroom where students learn hands-on about agriculture, science, and the environment. We rely on parent volunteers to keep the garden thriving!'
  const homepageHero = siteContent?.find(c => c.id === 'homepage_hero')?.content || 'Growing Minds, One Seed at a Time'

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent} animate-fade-in-up`}>
          <h1>{homepageHero}</h1>
          <p>{homepageMission}</p>
          <div className={styles.ctaGroup}>
            <Link href="/schedule" className="btn btn-primary">Volunteer Schedule & Weather</Link>
            <Link href="/register" className="btn btn-secondary">Register as Volunteer</Link>
          </div>
        </div>
      </section>

      {/* Quick Action Feature Grid */}
      <section className="container mt-6 mb-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          
          <Link href="/schedule" className="glass-panel p-5" style={{ textDecoration: 'none', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-purple)', marginBottom: '0.25rem' }}>Schedule & Weather</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Live mountain weather forecast, 45-min class blocks, and parent volunteer sign-ups.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 'bold', marginTop: '1rem' }}>View Schedule &rarr;</span>
          </Link>

          <Link href="/growing" className="glass-panel p-5" style={{ textDecoration: 'none', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-purple)', marginBottom: '0.25rem' }}>What's Growing</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Interactive 10×3 square-foot bed maps and printable QR signs for Beds 1–12.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 'bold', marginTop: '1rem' }}>Explore Beds &rarr;</span>
          </Link>

          <Link href="/wishlist" className="glass-panel p-5" style={{ textDecoration: 'none', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-purple)', marginBottom: '0.25rem' }}>Garden Wishlist</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Support our students by pledging organic compost, seeds, tools, and supplies.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 'bold', marginTop: '1rem' }}>View Supply Drive &rarr;</span>
          </Link>

          <Link href="/curriculum" className="glass-panel p-5" style={{ textDecoration: 'none', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-purple)', marginBottom: '0.25rem' }}>Curriculum & Lessons</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Structured hands-on units for soil science, fall planting, worms, and tasting.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 'bold', marginTop: '1rem' }}>Browse Curriculum &rarr;</span>
          </Link>

        </div>
      </section>

      <section className={`container ${styles.mission}`}>
        <div className={`glass-panel ${styles.missionCard}`}>
          <h2>Our Mission</h2>
          <p>
            The Loma Prieta School Garden provides a hands-on learning environment 
            where students discover the wonders of nature, the science of agriculture, 
            and the importance of sustainability. We believe every seed planted is a 
            step toward a greener, healthier community.
          </p>
        </div>
      </section>

      <section className={`container ${styles.highlights}`}>
        <h2>Recent Highlights</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <img src="/images/spring_harvest.jpg" alt="Autumn Corn Harvest" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3>Autumn Harvest & Tasting</h3>
              <p>Students harvesting colorful Indian corn and seasonal vegetables right from our beds!</p>
              <Link href="/updates">Read more &rarr;</Link>
            </div>
          </div>
          <div className={styles.card}>
            <img src="/images/scarecrow.jpg" alt="Scarecrow Building in the Garden" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3>Garden Helpers & Scarecrows</h3>
              <p>Kindergarten and primary classes getting hands-on with garden care and scarecrow building.</p>
              <Link href="/updates">Read more &rarr;</Link>
            </div>
          </div>
          <div className={styles.card}>
            <img src="/images/beekeeper.jpg" alt="Pollinators and Beekeeping" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3>Ecology & Pollinators</h3>
              <p>Learning all about our local pollinator friends and hive ecosystems up close.</p>
              <Link href="/updates">Read more &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
