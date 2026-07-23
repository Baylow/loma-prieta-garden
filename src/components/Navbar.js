"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMenu}>Loma<span className={styles.highlight}>Garden</span></Link>
        </div>
        
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`${styles.bar} ${isOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.open : ''}`}></span>
        </button>

        <nav className={`${styles.navLinks} ${isOpen ? styles.showMenu : ''}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/about" onClick={closeMenu}>About</Link>
          <Link href="/growing" onClick={closeMenu}>What's Growing</Link>
          <Link href="/curriculum" onClick={closeMenu}>Curriculum</Link>
          <Link href="/volunteer" onClick={closeMenu}>Volunteer</Link>
          <Link href="/donate" onClick={closeMenu}>Donate</Link>
          <Link href="/updates" onClick={closeMenu}>Updates</Link>
        </nav>
      </div>
    </header>
  );
}
