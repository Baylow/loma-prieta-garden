'use client';

import { useState } from 'react';

export default function BedPlacards({ beds }) {
  const [selectedBed, setSelectedBed] = useState('all');

  const displayedBeds = selectedBed === 'all' 
    ? beds 
    : beds.filter(b => b.bedNumberOnly === selectedBed);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Controls Bar (Hidden on Print) */}
      <div 
        className="no-print glass-panel" 
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Select Placard:</label>
          <select 
            value={selectedBed} 
            onChange={(e) => setSelectedBed(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.9rem', fontWeight: '500' }}
          >
            <option value="all">🖨️ All Beds (12 Placards - 1 per page)</option>
            {beds.map(b => (
              <option key={b.id} value={b.bedNumberOnly}>{b.bed_number}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handlePrint}
          className="btn btn-primary"
          style={{
            padding: '0.6rem 1.5rem',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(102, 46, 128, 0.2)'
          }}
        >
          <span>🖨️</span>
          <span>{selectedBed === 'all' ? 'Print All 12 Placards (PDF)' : `Print Bed ${selectedBed} Placard`}</span>
        </button>
      </div>

      {/* Placards Container */}
      <div className="placards-container">
        {displayedBeds.map(bed => (
          <div 
            key={bed.id}
            className="bed-placard-page"
            style={{
              backgroundColor: '#ffffff',
              border: '4px solid var(--primary-purple)',
              borderRadius: '16px',
              padding: '2.5rem',
              marginBottom: '3rem',
              maxWidth: '750px',
              margin: '0 auto 3rem auto',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              position: 'relative'
            }}
          >
            {/* Header / Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1.25rem' }}>
              <img 
                src="/images/logo.jpg" 
                alt="Loma Cougar Logo" 
                style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-purple)', letterSpacing: '0.5px' }}>
                  LOMA PRIETA SCHOOL GARDEN
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                  Living Classroom & Community Garden
                </div>
              </div>
            </div>

            {/* Giant Bed Title */}
            <div style={{ margin: '1rem 0 0.5rem 0' }}>
              <span 
                style={{
                  fontSize: '3.5rem',
                  fontWeight: '900',
                  color: 'var(--sapphire-blue)',
                  letterSpacing: '2px',
                  lineHeight: '1.1',
                  display: 'inline-block',
                  backgroundColor: 'rgba(59, 181, 181, 0.1)',
                  padding: '0.2rem 1.5rem',
                  borderRadius: '12px',
                  border: '2px solid rgba(59, 181, 181, 0.3)'
                }}
              >
                {bed.bed_number.toUpperCase()}
              </span>
            </div>

            {/* QR Code Container */}
            <div style={{ margin: '1.5rem auto', display: 'inline-block', padding: '1rem', backgroundColor: '#fff', border: '3px solid #1e293b', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <img 
                src={bed.qrDataUrl} 
                alt={`QR code for ${bed.bed_number}`} 
                style={{ width: '220px', height: '220px', display: 'block', margin: '0 auto' }} 
              />
            </div>

            {/* Call to Action Instructions */}
            <div style={{ maxWidth: '550px', margin: '0 auto 1.5rem auto' }}>
              <h3 style={{ color: 'var(--primary-purple)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                📱 Scan with Camera to Explore What's Growing!
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.4' }}>
                Open your phone's camera to inspect this bed's interactive <strong>10×3 square-foot planting grid</strong>, harvest dates, and student notes.
              </p>
            </div>

            {/* Crop Highlights if known */}
            {bed.distinctCrops.length > 0 && (
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'inline-block', maxWidth: '90%' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginRight: '0.5rem' }}>
                  Planted in this bed:
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: '600' }}>
                  {bed.distinctCrops.join(', ')}
                </span>
              </div>
            )}

            {/* Footer Direct Link */}
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
              Direct link: {bed.destinationUrl}
            </div>

          </div>
        ))}
      </div>

      {/* Print Specific Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: portrait;
            margin: 0.5in;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, header, footer, nav {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .bed-placard-page {
            box-shadow: none !important;
            margin: 0 auto !important;
            page-break-after: always !important;
            break-after: page !important;
            border: 4px solid #333 !important;
            height: 9.5in !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
          }
          .bed-placard-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
