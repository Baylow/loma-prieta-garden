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
            <Link href="/register" className="btn btn-primary">Get Involved</Link>
          </div>
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
            <img src="/images/spring_harvest.jpg" alt="Spring Harvest Festival" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3>Spring Harvest Festival</h3>
              <p>Join us this weekend as we harvest our first batch of spring vegetables!</p>
              <Link href="/updates">Read more &rarr;</Link>
            </div>
          </div>
          <div className={styles.card}>
            <img src="/images/raised_beds.jpg" alt="New Raised Beds" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3>New Raised Beds</h3>
              <p>Thanks to our wonderful volunteers, we now have 5 new raised beds for the 3rd graders.</p>
              <Link href="/updates">Read more &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
