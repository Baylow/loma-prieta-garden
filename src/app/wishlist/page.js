import { createClient } from '@/utils/supabase/server';
import WishlistClient from './WishlistClient';
import Link from 'next/link';

export default async function WishlistPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  let currentUserProfile = null;
  if (user) {
    const { data: prof } = await supabase.from('profiles').select('name, email').eq('id', user.id).single();
    currentUserProfile = prof;
  }

  // Fetch real wishlist items from Supabase
  const { data: dbItems } = await supabase
    .from('wishlist_items')
    .select('*')
    .order('created_at', { ascending: false });

  const items = dbItems || [];

  // Fetch claims if available
  const { data: claims } = await supabase.from('wishlist_claims').select('*');

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <div className="text-center mb-8">
        <h1 className="mb-2">🎁 Garden Wishlist & Supply Drive</h1>
        <p className="text-muted" style={{ maxWidth: '650px', margin: '0 auto' }}>
          Help our living classroom flourish! Support Loma Prieta students by pledging needed tools, organic soil, seeds, or building supplies.
        </p>
      </div>

      <WishlistClient 
        initialItems={items} 
        claims={claims || []} 
        currentUserProfile={currentUserProfile} 
      />
    </div>
  );
}
