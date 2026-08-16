import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.brand}>
          <h3>Loma Prieta School Garden</h3>
          <p>Growing together, learning together.</p>
        </div>
        <div className={styles.links}>
          <Link href="/about">About</Link>
          <Link href="/volunteer">Volunteer Shifts</Link>
          <Link href="/register">Register to Volunteer</Link>
        </div>
      </div>
    </footer>
  );
}
