'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function GrowingViewer({ beds }) {
  const searchParams = useSearchParams();
  const bedQuery = searchParams.get('bed');
  const [activeBedFilter, setActiveBedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const bedRefs = useRef({});

  useEffect(() => {
    if (bedQuery) {
      const numOnly = bedQuery.replace(/\D/g, '');
      setActiveBedFilter(numOnly);
      setTimeout(() => {
        const el = bedRefs.current[numOnly];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [bedQuery]);

  const filteredBeds = beds.filter(bed => {
    const numOnly = bed.bed_number.replace(/\D/g, '');
    if (activeBedFilter !== 'all' && numOnly !== activeBedFilter) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const grid = Array.isArray(bed.grid_data) ? bed.grid_data : [];
      const hasPlant = grid.some(c => c && c.toLowerCase().includes(term));
      const hasTitle = (bed.bed_number || '').toLowerCase().includes(term) || (bed.plant_name || '').toLowerCase().includes(term) || (bed.description || '').toLowerCase().includes(term);
      return hasPlant || hasTitle;
    }
    return true;
  });

  return (
    <div>
      {/* Banner if visited from QR scan */}
      {bedQuery && (
        <div 
          style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>📱</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#166534', fontSize: '1rem' }}>
                Scanned QR Code for Bed {bedQuery.replace(/\D/g, '')}!
              </div>
              <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                Showing the live 10×3 square-foot map for this specific raised bed.
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveBedFilter('all')} 
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Show All 12 Beds
          </button>
        </div>
      )}

      {/* Action and Filter Toolbar */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.25rem', 
          marginBottom: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          backgroundColor: '#faf8fc',
          border: '1px solid rgba(102, 46, 128, 0.12)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 250px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search crops (e.g. Carrots, Lettuce, Herbs)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '350px',
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/growing/qr" 
              className="btn btn-primary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary-purple)'
              }}
            >
              <span>📱</span>
              <span>Print Bed QR Signs</span>
            </Link>
          </div>

        </div>

        {/* Quick Bed Selector Pill Row */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem', alignItems: 'center' }}>
          <button
            onClick={() => setActiveBedFilter('all')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeBedFilter === 'all' ? 'var(--primary-purple)' : '#e2e8f0',
              color: activeBedFilter === 'all' ? '#ffffff' : '#475569'
            }}
          >
            All Beds (12)
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
            const isSelected = activeBedFilter === num.toString();
            return (
              <button
                key={num}
                onClick={() => setActiveBedFilter(num.toString())}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--primary-purple)' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  boxShadow: isSelected ? '0 2px 6px rgba(102, 46, 128, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                  border: isSelected ? '1px solid var(--primary-purple)' : '1px solid #cbd5e1'
                }}
              >
                Bed {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bed Cards Grid */}
      {filteredBeds.length === 0 ? (
        <div className="text-center text-muted glass-panel p-8">
          <p>No garden beds matched your search criteria.</p>
          <button onClick={() => { setActiveBedFilter('all'); setSearchTerm(''); }} className="btn btn-secondary mt-4">
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredBeds.map((bed, index) => {
            const numOnly = bed.bed_number.replace(/\D/g, '');
            const isTargetBed = activeBedFilter === numOnly;
            const grid = Array.isArray(bed.grid_data) && bed.grid_data.length === 30 ? bed.grid_data : Array(30).fill('');
            
            // Collect crops list
            const plantedCrops = Array.from(new Set(grid.filter(c => c && c.trim() !== '')));

            return (
              <div 
                key={bed.id} 
                ref={el => bedRefs.current[numOnly] = el}
                className="glass-panel p-5"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  border: isTargetBed ? '3px solid var(--teal)' : '1px solid rgba(102, 46, 128, 0.1)',
                  boxShadow: isTargetBed ? '0 0 20px rgba(59, 181, 181, 0.3)' : '0 4px 15px rgba(0,0,0,0.04)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--primary-purple)', margin: 0, fontSize: '1.25rem' }}>
                      {bed.bed_number}
                    </h3>
                    {bed.plant_name && bed.plant_name !== 'Mixed' && (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{bed.plant_name}</span>
                    )}
                  </div>

                  <Link 
                    href={`/growing/qr`} 
                    title="Print QR sign for this bed"
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(59, 181, 181, 0.1)',
                      color: 'var(--teal)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    📱 QR Sign
                  </Link>
                </div>
                
                {/* 10x3 Square-Foot Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(10, 1fr)', 
                  gridTemplateRows: 'repeat(3, 1fr)', 
                  gap: '3px',
                  backgroundColor: '#6e441c', // Rich redwood frame color
                  padding: '7px',
                  borderRadius: '6px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
                }}>
                  {grid.map((cell, i) => {
                    const isPlanted = cell && cell.trim() !== '';
                    const matchesSearch = searchTerm && isPlanted && cell.toLowerCase().includes(searchTerm.toLowerCase());

                    return (
                      <div 
                        key={i} 
                        title={`Square ${i + 1}: ${cell || 'Empty Soil'}`}
                        style={{
                          aspectRatio: '1',
                          backgroundColor: matchesSearch 
                            ? '#fef08a' 
                            : isPlanted 
                            ? 'rgba(255,255,255,0.92)' 
                            : 'rgba(50, 25, 10, 0.35)',
                          border: matchesSearch ? '2px solid #ca8a04' : '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.58rem',
                          fontWeight: '600',
                          textAlign: 'center',
                          padding: '1px',
                          overflow: 'hidden',
                          color: '#0f172a',
                          wordBreak: 'break-word',
                          lineHeight: '1.05',
                          cursor: 'default'
                        }}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <span>10 ft &rarr;</span>
                  <span>10×3 (30 sq ft total)</span>
                  <span>&uarr; 3 ft</span>
                </div>

                {/* Planted Summary */}
                {plantedCrops.length > 0 ? (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Crops in this bed:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {plantedCrops.map((crop, idx) => (
                        <span 
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontWeight: '500'
                          }}
                        >
                          🌿 {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Bed cleared / ready for seasonal planting.
                  </div>
                )}

                {bed.description && (
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0 }}>
                    {bed.description}
                  </p>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
