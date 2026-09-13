'use client';

import { useState } from 'react';
import { claimWishlistItem } from './actions';

const CATEGORIES = [
  'All Items',
  'Soil & Compost',
  'Tools & Gear',
  'Seeds & Starts',
  'Classroom Supplies',
  'Building Materials'
];

export default function WishlistClient({ initialItems, claims, currentUserProfile }) {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [claimingItem, setClaimingItem] = useState(null);
  const [donorName, setDonorName] = useState(currentUserProfile?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUserProfile?.email || '');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const filteredItems = (initialItems || []).filter(item => {
    if (selectedCategory === 'All Items') return true;
    return item.category === selectedCategory;
  });

  const openClaimModal = (item) => {
    setClaimingItem(item);
    const remaining = Math.max(1, item.quantity_needed - (item.quantity_claimed || 0));
    setQuantity(Math.min(1, remaining));
    setNotes('');
    setErrorMessage(null);
  };

  const closeClaimModal = () => {
    setClaimingItem(null);
    setSubmitting(false);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('item_id', claimingItem.id);
    formData.append('donor_name', donorName);
    formData.append('donor_email', donorEmail);
    formData.append('quantity', quantity.toString());
    formData.append('notes', notes);

    const res = await claimWishlistItem(formData);

    setSubmitting(false);
    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage(`Thank you, ${donorName}! Your pledge for ${quantity}x "${claimingItem.title}" has been recorded. You can drop supplies off at the Loma Garden shed or front office!`);
      closeClaimModal();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return { label: '🔴 Urgent Priority', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' };
      case 'needed_soon':
        return { label: '🟡 Needed Soon', bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
      default:
        return { label: '🟢 Standard Need', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
    }
  };

  return (
    <div>
      {/* Thank you notification */}
      {successMessage && (
        <div 
          style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>🎉</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#166534', fontSize: '1rem' }}>Pledge Confirmed!</div>
              <div style={{ fontSize: '0.9rem', color: '#15803d', marginTop: '0.2rem' }}>{successMessage}</div>
            </div>
          </div>
          <button 
            onClick={() => setSuccessMessage(null)}
            style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: selectedCategory === cat ? '1px solid var(--primary-purple)' : '1px solid #cbd5e1',
              backgroundColor: selectedCategory === cat ? 'var(--primary-purple)' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#475569',
              boxShadow: selectedCategory === cat ? '0 2px 8px rgba(102, 46, 128, 0.25)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center text-muted glass-panel p-8">
          <p>No wishlist items currently listed in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map(item => {
            const needed = item.quantity_needed || 1;
            const claimed = item.quantity_claimed || 0;
            const isFulfilled = claimed >= needed;
            const percentClaimed = Math.min(100, Math.round((claimed / needed) * 100));
            const urgency = getUrgencyBadge(item.urgency);

            return (
              <div 
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  border: isFulfilled ? '1px solid #86efac' : '1px solid rgba(102, 46, 128, 0.1)',
                  backgroundColor: isFulfilled ? '#fafffd' : '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span 
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        backgroundColor: urgency.bg,
                        color: urgency.color,
                        border: `1px solid ${urgency.border}`
                      }}
                    >
                      {urgency.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>
                      {item.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-purple)', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.4', marginBottom: '1rem' }}>
                      {item.description}
                    </p>
                  )}
                </div>

                <div>
                  {/* Progress bar */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#64748b' }}>
                        <strong>{claimed}</strong> of <strong>{needed}</strong> donated / pledged
                      </span>
                      <span style={{ fontWeight: 'bold', color: isFulfilled ? '#16a34a' : 'var(--teal)' }}>
                        {isFulfilled ? '✓ 100% Fulfilled!' : `${percentClaimed}%`}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{
                          width: `${percentClaimed}%`,
                          height: '100%',
                          backgroundColor: isFulfilled ? '#22c55e' : 'var(--teal)',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Claim Button */}
                  {isFulfilled ? (
                    <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#dcfce7', borderRadius: '6px', color: '#166534', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      🎉 Goal Met — Thank You!
                    </div>
                  ) : (
                    <button
                      onClick={() => openClaimModal(item)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.55rem 1rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <span>🎁</span>
                      <span>I Can Donate This ({needed - claimed} needed)</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Donation / Claim Modal */}
      {claimingItem && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 'bold' }}>
                  Pledge Supply Donation
                </span>
                <h3 style={{ color: 'var(--primary-purple)', fontSize: '1.25rem', marginTop: '0.2rem' }}>
                  {claimingItem.title}
                </h3>
              </div>
              <button 
                onClick={closeClaimModal}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            {errorMessage && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Your Name *
                </label>
                <input 
                  type="text" 
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="e.g. jane@example.com"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Quantity You Can Donate
                </label>
                <input 
                  type="number" 
                  min="1"
                  max={Math.max(1, claimingItem.quantity_needed - (claimingItem.quantity_claimed || 0))}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Drop-off / Timing Notes (Optional)
                </label>
                <textarea 
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Will drop off at garden shed Tuesday morning"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                📍 <strong>Drop-off Location:</strong> Loma Prieta School Garden Shed or Front Office marked <em>"Attn: Loma Garden Team"</em>.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={closeClaimModal}
                  className="btn btn-secondary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Submitting...' : 'Confirm Pledge 🎁'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
