import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Loma Prieta <span className={styles.highlight}>Garden</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/growing">What's Growing</Link>
          <Link href="/curriculum">Curriculum</Link>
          <Link href="/volunteer">Volunteer</Link>
          <Link href="/donate">Donate</Link>
          <Link href="/updates">Updates</Link>
        </nav>
      </div>
    </header>
  );
}
