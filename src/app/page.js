import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent} animate-fade-in-up`}>
          <h1>Growing Our Future</h1>
          <p>Welcome to the Loma Prieta School Garden Project. A space for learning, connecting, and growing together.</p>
          <div className={styles.ctaGroup}>
            <Link href="/volunteer" className="btn btn-primary">Get Involved</Link>
            <Link href="/donate" className="btn btn-secondary">Support Us</Link>
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
