"use client";
import Image from 'next/image';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function Growing() {
  const supabase = await createClient()
  
  // Fetch garden beds
  const { data: beds } = await supabase.from('garden_beds').select('*').order('bed_number', { ascending: true })

  return (
    <div className="container mt-8 animate-fade-in-down">
      <h1 className="text-center mb-4">What's Growing</h1>
      <p className="text-center mb-8 text-muted">Explore the current plants and produce thriving in our garden beds.</p>
      
      {(!beds || beds.length === 0) ? (
        <div className="text-center text-muted" style={{ padding: '3rem' }}>
          <p>The garden beds are currently being prepared for the next season.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {beds.map((bed, index) => (
            <div key={bed.id} className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.cardInner}>
                {/* Front of card */}
                <div className={styles.cardFront}>
                  <div className={styles.imageContainer}>
                    {/* Placeholder colored box if image is missing */}
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--tan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-purple)' }}>
                      <span style={{ fontSize: '3rem' }}>🌱</span>
                    </div>
                  </div>
                  <div className={styles.cardInfo}>
                    <span className={styles.bedBadge}>{bed.bed_number}</span>
                    <h3>{bed.plant_name}</h3>
                  </div>
                </div>
                
                {/* Back of card */}
                <div className={styles.cardBack}>
                  <div className={styles.cardInfo}>
                    <span className={styles.bedBadge}>{bed.bed_number}</span>
                    <h3>{bed.plant_name}</h3>
                    <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>{bed.description}</p>
                    <div className={styles.harvestInfo}>
                      <strong>Expected Harvest:</strong>
                      <span>{bed.harvest_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
