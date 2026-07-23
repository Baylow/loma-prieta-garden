"use client";
import { useState } from 'react';
import styles from './page.module.css';

const produceData = [
  { id: 1, name: 'Cherry Tomatoes', icon: '🍅', planted: 'March', harvest: 'Summer', fact: 'Tomatoes are technically fruit, not vegetables!' },
  { id: 2, name: 'Carrots', icon: '🥕', planted: 'April', harvest: 'Late Spring', fact: 'Carrots were originally purple, not orange.' },
  { id: 3, name: 'Sunflowers', icon: '🌻', planted: 'May', harvest: 'Late Summer', fact: 'They turn their heads to follow the sun.' },
  { id: 4, name: 'Lettuce', icon: '🥬', planted: 'March', harvest: 'Spring', fact: 'Lettuce is part of the daisy and sunflower family.' },
  { id: 5, name: 'Pumpkins', icon: '🎃', planted: 'June', harvest: 'Fall', fact: 'Will be ready just in time for our fall festival.' },
  { id: 6, name: 'Zucchini', icon: '🥒', planted: 'April', harvest: 'Summer', fact: 'One plant can produce 10 lbs of squash!' },
  { id: 7, name: 'Radishes', icon: '🥗', planted: 'March', harvest: 'Spring', fact: 'They grow super fast, ready in just 30 days.' },
  { id: 8, name: 'Strawberries', icon: '🍓', planted: 'Fall', harvest: 'Spring', fact: 'The only fruit with seeds on the outside.' },
];

function FlipCard({ item }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={styles.cardContainer} onClick={() => setFlipped(!flipped)}>
      <div className={`${styles.cardInner} ${flipped ? styles.flipped : ''}`}>
        <div className={styles.cardFront}>
          <div className={styles.icon}>{item.icon}</div>
          <h3>{item.name}</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, marginTop: '0.5rem' }}>Click to flip ↺</p>
        </div>
        <div className={styles.cardBack}>
          <h3>{item.name}</h3>
          <div className={styles.backDetails}>
            <p><strong>Planted:</strong> {item.planted}</p>
            <p><strong>Harvest:</strong> {item.harvest}</p>
            <p className={styles.fact}>"{item.fact}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Growing() {
  return (
    <div className="container mt-8 animate-fade-in-down">
      <h1 className="text-center mb-2">What's Growing?</h1>
      <p className="text-center mb-8 text-muted">Explore the plants in our garden. Click on any card to flip it and learn more!</p>
      
      <div className={styles.grid}>
        {produceData.map(item => (
          <FlipCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
