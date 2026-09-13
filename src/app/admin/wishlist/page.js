import { createClient } from '@/utils/supabase/server';
import { createWishlistItem, deleteWishlistItem, updateWishlistClaimStatus } from '../actions';
import Link from 'next/link';

export default async function AdminWishlistPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('wishlist_items')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: claims } = await supabase
    .from('wishlist_claims')
    .select('*, wishlist_items(title)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem', color: 'var(--sapphire-blue)' }}>Garden Wishlist Management</h2>
          <p className="text-muted">Post needed garden tools, soil, and supplies, and manage parent donations.</p>
        </div>
        <div>
          <Link href="/wishlist" target="_blank" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            View Public Wishlist ↗
          </Link>
        </div>
      </div>

      {/* Add New Wishlist Item Form */}
      <div style={{ padding: '1.5rem', backgroundColor: '#f8f6fc', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-purple)' }}>+ Add New Needed Supply Item</h3>
        
        <form action={createWishlistItem} className="flex flex-col gap-4">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div className="flex flex-col gap-1">
              <label style={{ fontWeight: '500', fontSize: '0.85rem' }}>Item Title *</label>
              <input type="text" name="title" placeholder="e.g. 50-ft Garden Hose with Spray Nozzle" required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontWeight: '500', fontSize: '0.85rem' }}>Category *</label>
              <select name="category" required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                <option value="Tools & Gear">Tools & Gear</option>
                <option value="Soil & Compost">Soil & Compost</option>
                <option value="Seeds & Starts">Seeds & Starts</option>
                <option value="Classroom Supplies">Classroom Supplies</option>
                <option value="Building Materials">Building Materials</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontWeight: '500', fontSize: '0.85rem' }}>Quantity Needed *</label>
              <input type="number" name="quantity_needed" defaultValue="1" min="1" required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="flex flex-col gap-1">
              <label style={{ fontWeight: '500', fontSize: '0.85rem' }}>Urgency Level</label>
              <select name="urgency" style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                <option value="normal">🟢 Standard Need</option>
                <option value="needed_soon">🟡 Needed Soon</option>
                <option value="urgent">🔴 Urgent Priority</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontWeight: '500', fontSize: '0.85rem' }}>Reference Link (Optional URL)</label>
              <input type="url" name="link_url" placeholder="https://..." style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '500', fontSize: '0.85rem' }}>Description & Specifications</label>
            <textarea name="description" rows="2" placeholder="Specific brand, dimensions, OMRI organic rating, or classroom use details..." style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem' }}>
            Publish to Wishlist
          </button>
        </form>
      </div>

      {/* Active Wishlist Items Table */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Current Wishlist Items ({items?.length || 0})</h3>
        
        {(!items || items.length === 0) ? (
          <p className="text-muted">No wishlist items posted yet. Add one above!</p>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Item</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Urgency</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Progress</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-purple)' }}>{item.title}</div>
                      {item.description && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{item.description}</div>}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{item.category}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                        {item.urgency.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>
                      {item.quantity_claimed || 0} / {item.quantity_needed} claimed
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <form action={deleteWishlistItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" style={{ background: 'none', border: 'none', color: '#ef4444', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem' }}>
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Donor Pledges & Claims Table */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Recent Pledges & Donations ({claims?.length || 0})</h3>
        
        {(!claims || claims.length === 0) ? (
          <p className="text-muted">No donor pledges recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Donor</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Item Pledged</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Qty</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Notes / Drop-off</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(claim => (
                  <tr key={claim.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>
                      <div>{claim.donor_name}</div>
                      <a href={`mailto:${claim.donor_email}`} style={{ fontSize: '0.75rem', color: 'var(--sapphire-blue)' }}>{claim.donor_email}</a>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>
                      {claim.wishlist_items?.title || 'Supply Item'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{claim.quantity}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {claim.notes || 'No specific drop-off note'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <form action={updateWishlistClaimStatus} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <input type="hidden" name="claim_id" value={claim.id} />
                        <select 
                          name="status" 
                          defaultValue={claim.status} 
                          style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}
                        >
                          <option value="pledged">⏳ Pledged</option>
                          <option value="delivered">✅ Delivered / Received</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                        <button type="submit" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
