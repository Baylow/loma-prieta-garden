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

      {/* Spacious 1x4 Quick Action Feature Row */}
      <section className={`container ${styles.featuresSection}`}>
        <div className={styles.featureRow}>
          
          <Link href="/schedule" className={styles.featureCard}>
            <div>
              <div className={styles.featureIcon}>📅</div>
              <h3>Schedule & Weather</h3>
              <p>
                Live mountain weather forecast, 45-min class blocks, and volunteer sign-ups.
              </p>
            </div>
            <div className={styles.featureLink}>
              <span>View Schedule</span>
              <span>&rarr;</span>
            </div>
          </Link>

          <Link href="/growing" className={styles.featureCard}>
            <div>
              <div className={styles.featureIcon}>🌿</div>
              <h3>What's Growing</h3>
              <p>
                Interactive 10×3 square-foot bed maps and printable QR signs for Beds 1–12.
              </p>
            </div>
            <div className={styles.featureLink}>
              <span>Explore Beds</span>
              <span>&rarr;</span>
            </div>
          </Link>

          <Link href="/wishlist" className={styles.featureCard}>
            <div>
              <div className={styles.featureIcon}>🎁</div>
              <h3>Garden Wishlist</h3>
              <p>
                Support our students by pledging organic compost, seeds, tools, and supplies.
              </p>
            </div>
            <div className={styles.featureLink}>
              <span>View Supply Drive</span>
              <span>&rarr;</span>
            </div>
          </Link>

          <Link href="/curriculum" className={styles.featureCard}>
            <div>
              <div className={styles.featureIcon}>📖</div>
              <h3>Curriculum & Lessons</h3>
              <p>
                Structured hands-on units for soil science, fall planting, worms, and tasting.
              </p>
            </div>
            <div className={styles.featureLink}>
              <span>Browse Curriculum</span>
              <span>&rarr;</span>
            </div>
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
